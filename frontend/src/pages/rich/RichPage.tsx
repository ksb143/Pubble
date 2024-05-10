// 1. react 관련
import { useState, useEffect } from 'react';
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
import Lottie from 'react-lottie';
// 3. api
// 4. store
import useRichStore from '@/stores/richStore';
// 5. component
import MenuBar from '@/components/rich/MenuBar.tsx';
import BubbleMenuBar from '@/components/rich/BubbleMenuBar.tsx';
import ImageUploadModal from '@/components/rich/ImageUploadModal.tsx';
import LinkUploadModal from '@/components/rich/LinkUploadModal.tsx';
import CodeEditorWithPreview from '@/components/rich/CodeEditorWithPreview.tsx';
// 6. image 등 assets
import LoadingAnimation from '@/assets/lotties/loading.json';
const { VITE_SCREENSHOT_API } = import.meta.env;

const lowlight = createLowlight(common);

const RichPage = () => {
  // useState
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] =
    useState<boolean>(false);
  const [isLinkUploadModalOpen, setIsLinkUploadModalOpen] =
    useState<boolean>(false);
  const [linkTabType, setLinkTabType] = useState<string>('');
  const { isCodeModalOpen, openCodePreviewModal, closeCodePreviewModal } =
    useRichStore();

  useEffect(() => {
    const handleCodeImageClick = (event: CustomEvent) => {
      console.log(event);
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

  // 파라미터
  const projectName = '브레드 이발소  단장 프로젝트';
  const requirementId = 'BREAD001';

  // 로티 기본 옵션
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

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
      FileHandler,
    ],
    content: '',
  });

  // url 스크린샷 집어넣는 함수
  const fetchScreenshotData = async (url: string) => {
    const response = await fetch(
      `https://api.screenshotone.com/animate?url=${encodeURIComponent(url)}&access_key=${VITE_SCREENSHOT_API}&format=gif`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch screenshot for URL: ${url}`);
    }
    const blob = await response.blob();
    console.log(blob);
    return URL.createObjectURL(blob);
  };

  // 이미지 삽입 함수
  const handleImageInsert = (image: string) => {
    editor?.chain().focus().setResizableImage({ src: image, width: 300 }).run();
    setIsImageUploadModalOpen(false);
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
          requirementId={requirementId}
          requirementName='좋아요 기능'
          projectName={projectName}
          openImageUploadModal={() => setIsImageUploadModalOpen(true)}
          openLinkUploadModal={(tabType: string) => {
            setLinkTabType(tabType);
            setIsLinkUploadModalOpen(true);
          }}
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
        />
        <LinkUploadModal
          tabType={linkTabType}
          isOpen={isLinkUploadModalOpen}
          onClose={() => setIsLinkUploadModalOpen(false)}
          onInsert={handleLinkInsert}
        />
      </div>
      {isCodeModalOpen && (
        <CodeEditorWithPreview
          isOpen={isCodeModalOpen}
          applyCodeCapture={captureCodeImage}
        />
      )}
    </div>
  );
};

export default RichPage;
