// 1. react 관련
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// 2. library
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { ResizableImageExtension } from '@/extensions/ResizableImageExtension.ts';
import { ExtendedImageExtension } from '@/extensions/ExtendedImageExtension.ts';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Color } from '@tiptap/extension-color';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import FileHandler from '@tiptap-pro/extension-file-handler';
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import Lottie from 'react-lottie';
// 3. api
import { getImageUrl, getFileUrl } from '@/apis/rich.ts';
// 4. store
import useRichStore from '@/stores/richStore';
import useUserStore from '@/stores/userStore.ts';
// 5. component
import MenuBar from '@/components/rich/MenuBar.tsx';
import BubbleMenuBar from '@/components/rich/BubbleMenuBar.tsx';
import ImageUploadModal from '@/components/rich/ImageUploadModal.tsx';
import LinkUploadModal from '@/components/rich/LinkUploadModal.tsx';
import CodeEditorWithPreview from '@/components/rich/CodeEditorWithPreview.tsx';
import Note from '@/components/rich/Note.tsx';
// 6. image 등 assets
import './RichPage.css';
import LoadingAnimation from '@/assets/lotties/loading.json';
import FileUploadModal from '@/components/rich/FileUploadModal.tsx';
const { VITE_SCREENSHOT_API, VITE_TIPTAP_APP_ID } = import.meta.env;

const notes = [
  { id: 'note-1', title: 'Note 1' },
  { id: 'note-2', title: 'Note 2' },
];

const RichPage = () => {
  // useState
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] =
    useState<boolean>(false);
  const [isLinkUploadModalOpen, setIsLinkUploadModalOpen] =
    useState<boolean>(false);
  const [linkTabType, setLinkTabType] = useState<string>('');
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] =
    useState<boolean>(false);
  const { isCodeModalOpen, openCodePreviewModal, closeCodePreviewModal } =
    useRichStore();
  const { name, profileColor } = useUserStore();

  // 파라미터
  const { projectId } = useParams<{ projectId: string }>();
  const projectIdNumber = Number(projectId);
  const { requirementId } = useParams<{ requirementId: string }>();
  const requirementIdNumber = Number(requirementId);

  // props
  const projectName = '브레드 이발소  단장 프로젝트';
  const requirementUniqueId = 'BREAD001';

  // 로티 기본 옵션
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // 코드 저조도 적용
  const lowlight = createLowlight(common);

  // 동시편집
  const doc = new Y.Doc();
  const accessToken = localStorage.getItem('accessToken');
  const provider = new TiptapCollabProvider({
    name: `${projectIdNumber}.${projectName}-${requirementIdNumber}.${requirementUniqueId}`,
    appId: VITE_TIPTAP_APP_ID,
    token: accessToken,
    document: doc,
  });
  // 실시간 연결상태
  provider.on('connect', () => {
    console.log(`${requirementUniqueId} synced`);
  });
  provider.on('disconnect', () => {
    console.log(`${requirementUniqueId} disconnected`);
  });
  // 문서 동기화 상태
  provider.on('synced', () => {
    alert('Document initialized');
  });
  // 인증 문제 처리
  provider.on('authenticationFailed', ({ reason }: { reason: string }) => {
    console.error('Authentication failed:', reason);
  });
  // 인식 필드 설정
  provider.setAwarenessField('user', {
    name: name,
    color: profileColor,
  });
  // 변경 사항 듣기
  provider.on('awarenessChange', ({ states }: { states: string }) => {
    console.log('Awareness change', states);
  });
  // 마우스 움직임 추적
  document.addEventListener('mousemove', (event) => {
    // Share any information you like
    provider.setAwarenessField('user', {
      name: name,
      color: profileColor,
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  });

  // 에디터 확장 기능
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        HTMLAttributes: {
          class: 'underline text-pubble cursor-pointer hover:text-blue-700',
        },
      }),
      ResizableImageExtension,
      ExtendedImageExtension,
      Table.configure({
        resizable: true,
      }),
      TableCell,
      TableHeader,
      TableRow,
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: 'language-',
        defaultLanguage: 'plaintext',
        HTMLAttributes: {
          class: 'bg-code-bg text-code-text py-4 p-4 rounded-md',
        },
      }),
      Color,
      TextStyle,
      Highlight.configure({
        HTMLAttributes: {
          style: 'background-color',
        },
        multicolor: true,
      }),
      FileHandler.configure({
        onPaste: async (editor, files) => {
          for (const file of files) {
            if (file.type.startsWith('image/')) {
              try {
                const imageUrl = await getImageUrl(file, requirementIdNumber);
                editor
                  .chain()
                  .focus()
                  .setResizableImage({ src: imageUrl, width: 300 })
                  .run();
              } catch (error) {
                console.error('Image uplad failed: ', error);
              }
            } else {
              try {
                const fileUrl = await getFileUrl(file, requirementIdNumber);
                editor
                  .chain()
                  .focus()
                  .insertContent(
                    `<a href="${fileUrl}" target="_blank" download="${file.name}">${file.name}</a>`,
                  )
                  .run();
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
                const imageUrl = await getImageUrl(file, requirementIdNumber);
                editor
                  .chain()
                  .focus()
                  .setTextSelection(position)
                  .setResizableImage({ src: imageUrl, width: 300 })
                  .run();
              } catch (error) {
                console.error('Image upload failed: ', error);
              }
            } else {
              try {
                const fileUrl = await getFileUrl(file, requirementIdNumber);
                editor
                  .chain()
                  .focus()
                  .setTextSelection(position)
                  .insertContent(
                    `<a href="${fileUrl}" target="_blank" download="${file.name}">${file.name}</a>`,
                  )
                  .run();
              } catch (error) {
                console.error('File upload failed: ', error);
              }
            }
          }
        },
        allowedMimeTypes: [
          'text/plain',
          'application/msword',
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/gif',
        ],
      }),
      Collaboration.configure({
        document: doc,
      }),
    ],
    content: `
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>      
    `,
  });

  // url 스크린샷 집어넣는 함수
  const fetchScreenshotData = async (url: string) => {
    const response = await fetch(
      `https://api.screenshotone.com/animate?url=${encodeURIComponent(url)}&access_key=${VITE_SCREENSHOT_API}&format=gif`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch screenshot for URL: ${url}`);
    }
    try {
      const blob = await response.blob();
      const fileName = `screenshot-${new Date().getTime()}.gif`;
      const file = new File([blob], fileName, { type: blob.type });
      const imageUrl = await getImageUrl(file, requirementIdNumber);
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
        editor
          ?.chain()
          .focus()
          .setResizableImage({ src: screenshotUrl, width: 300 })
          .run();
      } catch (error) {
        console.error('Failed to fetch screenshot for URL: ', error);
        editor
          ?.chain()
          .focus()
          .insertContent(`페이지 스크린샷 로드에 실패했습니다: ${link}`)
          .run();
      }
    }
    setIsLinkUploadModalOpen(false);
  };

  // 코드 이미지 캡쳐 함수
  const captureCodeImage = (
    imageDataUrl: string,
    html: string,
    css: string,
    javascript: string,
  ) => {
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

  // 코드이미지 클릭 이벤트 감지
  useEffect(() => {
    const handleCodeImageClick = (event: CustomEvent) => {
      const { html, css, javascript } = event.detail;
      openCodePreviewModal(html, css, javascript);
    };
    document.addEventListener(
      'codeImageClicked',
      handleCodeImageClick as EventListener,
    );
    return () => {
      document.removeEventListener(
        'codeImageClicked',
        handleCodeImageClick as EventListener,
      );
    };
  }, [openCodePreviewModal]);

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
          requirementUniqueId={requirementUniqueId}
          requirementName='좋아요 기능'
          projectName={projectName}
          openImageUploadModal={() => setIsImageUploadModalOpen(true)}
          openLinkUploadModal={(tabType: string) => {
            setLinkTabType(tabType);
            setIsLinkUploadModalOpen(true);
          }}
          openFileUploadModal={() => setIsFileUploadModalOpen(true)}
        />
      </div>
      <div className='col-span-10 col-start-2 h-screen p-6 shadow'>
        <EditorContent editor={editor}></EditorContent>
        <BubbleMenu>
          <BubbleMenuBar />
        </BubbleMenu>
        <ImageUploadModal
          isOpen={isImageUploadModalOpen}
          onClose={() => setIsImageUploadModalOpen(false)}
          onInsert={handleImageInsert}
          requirementId={requirementIdNumber}
        />
        <LinkUploadModal
          tabType={linkTabType}
          isOpen={isLinkUploadModalOpen}
          onClose={() => setIsLinkUploadModalOpen(false)}
          onInsert={handleLinkInsert}
        />
        <FileUploadModal
          isOpen={isFileUploadModalOpen}
          onClose={() => setIsFileUploadModalOpen(false)}
          onInsert={handleFileInsert}
          requireUniqueId={requirementIdNumber}
        />
      </div>
      {isCodeModalOpen && (
        <CodeEditorWithPreview
          isOpen={isCodeModalOpen}
          applyCodeCapture={captureCodeImage}
          requirementId={requirementIdNumber}
        />
      )}
    </div>
  );
};

export default RichPage;
