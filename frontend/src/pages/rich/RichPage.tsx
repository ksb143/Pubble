// 1. react 관련
import { useState, useEffect } from 'react';
// 2. library
import { useEditor, EditorContent } from '@tiptap/react';
import { extensions } from '@/extensions/Extensions.ts';
import FileHandler from '@tiptap-pro/extension-file-handler';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import { Collaboration } from '@tiptap/extension-collaboration';
import * as Y from 'yjs';
import Lottie from 'react-lottie';
// 3. api
import { getImageUrl, getFileUrl } from '@/apis/rich.ts';
// 4. store
import useUserStore from '@/stores/userStore.ts';
import useRichStore from '@/stores/richStore';
import usePageInfoStore from '@/stores/pageInfoStore.ts';
// 5. component
import MenuBar from '@/components/rich/MenuBar.tsx';
import ImageUploadModal from '@/components/rich/ImageUploadModal.tsx';
import LinkUploadModal from '@/components/rich/LinkUploadModal.tsx';
import CodeEditorWithPreview from '@/components/rich/CodeEditorWithPreview.tsx';
// 6. image 등 assets
import './RichPage.css';
import LoadingAnimation from '@/assets/lotties/loading.json';
import FileUploadModal from '@/components/rich/FileUploadModal.tsx';
const { VITE_SCREENSHOT_API, VITE_TIPTAP_APP_ID } = import.meta.env;

const RichPage = () => {
  // useState
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState<boolean>(false);
  const [isLinkUploadModalOpen, setIsLinkUploadModalOpen] = useState<boolean>(false);
  const [linkTabType, setLinkTabType] = useState<string>('');
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState<boolean>(false);
  const { name, profileColor } = useUserStore();
  const { isCodeModalOpen, openCodePreviewModal, closeCodePreviewModal } = useRichStore();
  const [editorHeight, setEditorHeight] = useState('auto');
  const { projectId, projectName, requirementId, requirementCode, requirementName } = usePageInfoStore();

  // 로티 기본 옵션
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // 동시편집 기본 옵션
  const doc = new Y.Doc();

  // 에디터 확장 기능
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `focus:outline-none`,
      },
    },
    extensions: [
      ...extensions,
      Collaboration.configure({
        document: doc,
      }),
      FileHandler.configure({
        onPaste: async (editor, files) => {
          for (const file of files) {
            if (file.type.startsWith('image/')) {
              try {
                const imageUrl = await getImageUrl(file, requirementId);
                editor.chain().focus().setResizableImage({ src: imageUrl, width: 300 }).run();
              } catch (error) {
                console.error('Image uplad failed: ', error);
              }
            } else {
              try {
                const fileUrl = await getFileUrl(file, requirementId);
                editor.chain().focus().insertContent(`<a href="${fileUrl}" target="_blank" download="${file.name}">${file.name}</a>`).run();
              } catch (error) {
                console.error('File upload failed: ', error);
              }
            }
          }
        },
        onDrop: async (editor, files, position) => {
          for (const file of files) {
            if (file.type.startsWith('image/')) {
              try {
                const imageUrl = await getImageUrl(file, requirementId);
                editor.chain().focus().setTextSelection(position).setResizableImage({ src: imageUrl, width: 300 }).run();
              } catch (error) {
                console.error('Image upload failed: ', error);
              }
            } else {
              try {
                const fileUrl = await getFileUrl(file, requirementId);
                editor.chain().focus().setTextSelection(position).insertContent(`<a href="${fileUrl}" target="_blank" download="${file.name}">${file.name}</a>`).run();
              } catch (error) {
                console.error('File upload failed: ', error);
              }
            }
          }
        },
        allowedMimeTypes: ['text/plain', 'application/msword', 'application/pdf', 'image/jpeg', 'image/png', 'image/gif'],
      }),
    ],
    content: '',
  });

  // 에디터 길이 감지
  useEffect(() => {
    const handleEditorResize = () => {
      const editorContent = document.querySelector('.ProseMirror') as HTMLElement;
      if (editorContent) {
        const contentHeight = editorContent.offsetHeight;
        setEditorHeight(`${contentHeight}px`);
      }
    };
    document.addEventListener('editorContentChanged', handleEditorResize);
    return () => {
      document.removeEventListener('editorContentChanged', handleEditorResize);
    };
  }, []);

  // 코드이미지 클릭 이벤트 감지
  useEffect(() => {
    const handleCodeImageClick = (event: CustomEvent) => {
      const { html, css, javascript } = event.detail;
      openCodePreviewModal(html, css, javascript);
    };
    document.addEventListener('codeImageClicked', handleCodeImageClick as EventListener);
    return () => {
      document.removeEventListener('codeImageClicked', handleCodeImageClick as EventListener);
    };
  }, [openCodePreviewModal]);

  // url 스크린샷 집어넣는 함수
  const fetchScreenshotData = async (url: string) => {
    const response = await fetch(`https://api.screenshotone.com/animate?url=${encodeURIComponent(url)}&access_key=${VITE_SCREENSHOT_API}&format=gif`);
    if (!response.ok) {
      throw new Error(`Failed to fetch screenshot for URL: ${url}`);
    }
    try {
      const blob = await response.blob();
      const fileName = `screenshot-${new Date().getTime()}.gif`;
      const file = new File([blob], fileName, { type: blob.type });
      const imageUrl = await getImageUrl(file, requirementId);
      return imageUrl;
    } catch (error) {
      console.error('Failed to upload image: ', error);
    }
  };
  // 이미지 삽입 함수
  const handleImageInsert = (image: string) => {
    editor?.chain().focus().setResizableImage({ src: image, width: 300 }).run();
    setIsImageUploadModalOpen(false);
  };
  // 파일 삽입 함수
  const handleFileInsert = (fileUrl: string, fileName: string) => {
    const linkHtml = `<a href="${fileUrl}" target="_blank" download="${fileName}">${fileName}</a>`;
    editor?.chain().focus().insertContent(linkHtml).run();
    setIsFileUploadModalOpen(false);
  };
  // 링크 삽입 함수
  const handleLinkInsert = async (link: string, linkType: string) => {
    if (linkType === 'link') {
      editor?.chain().focus().setLink({ href: link, target: '_blank' }).run();
    } else if (linkType === 'webImage') {
      try {
        const screenshotUrl = await fetchScreenshotData(link);
        editor?.chain().focus().setResizableImage({ src: screenshotUrl, width: 300 }).run();
      } catch (error) {
        console.error('Failed to fetch screenshot for URL: ', error);
        editor?.chain().focus().insertContent(`페이지 스크린샷 로드에 실패했습니다: ${link}`).run();
      }
    }
    setIsLinkUploadModalOpen(false);
  };
  // 코드 이미지 캡쳐 함수
  const captureCodeImage = (imageDataUrl: string, html: string, css: string, javascript: string) => {
    editor
      ?.chain()
      .focus()
      .insertContent({
        type: 'extendedImage',
        attrs: {
          src: imageDataUrl,
          html: html,
          css: css,
          javascript: javascript,
        },
      })
      .run();
    closeCodePreviewModal();
  };

  // 에디터가 없을 경우
  if (!editor) {
    return <Lottie options={defaultOptions} height={500} width={500} />;
  }

  // 에디터가 있을 경우
  return (
    <div className='mx-12 mt-10 grid grid-cols-12'>
      <div className='col-span-10 col-start-2'>
        <MenuBar
          editor={editor}
          requirementCode={requirementCode}
          requirementName={requirementName}
          projectName={projectName}
          openImageUploadModal={() => setIsImageUploadModalOpen(true)}
          openLinkUploadModal={(tabType: string) => {
            setLinkTabType(tabType);
            setIsLinkUploadModalOpen(true);
          }}
          openFileUploadModal={() => setIsFileUploadModalOpen(true)}
        />
      </div>
      <div className='col-span-10 col-start-2 mb-4 h-screen bg-white p-6 shadow-custom' style={{ height: editorHeight }}>
        <EditorContent editor={editor}></EditorContent>
        <ImageUploadModal isOpen={isImageUploadModalOpen} onClose={() => setIsImageUploadModalOpen(false)} onInsert={handleImageInsert} requirementId={requirementId} />
        <LinkUploadModal tabType={linkTabType} isOpen={isLinkUploadModalOpen} onClose={() => setIsLinkUploadModalOpen(false)} onInsert={handleLinkInsert} />
        <FileUploadModal isOpen={isFileUploadModalOpen} onClose={() => setIsFileUploadModalOpen(false)} onInsert={handleFileInsert} requireUniqueId={requirementId} />
        {isCodeModalOpen && <CodeEditorWithPreview isOpen={isCodeModalOpen} applyCodeCapture={captureCodeImage} requirementId={requirementId} />}
      </div>
    </div>
  );
};

export default RichPage;
