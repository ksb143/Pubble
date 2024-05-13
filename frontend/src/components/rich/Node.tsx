// 1. react 관련
import { useEffect, useState } from 'react';
// 2. library
import {
  BubbleMenu,
  EditorContent,
  useEditor,
  Editor as TiptapEditor,
} from '@tiptap/react';
import { Transaction } from 'prosemirror-state';
import { extensions } from '@/extensions/Extensions';
import FileHandler from '@tiptap-pro/extension-file-handler';
import Collaboration from '@tiptap/extension-collaboration';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
// 3. api
import { getImageUrl, getFileUrl } from '@/apis/rich.ts';
// 4. store
import useRichStore from '@/stores/richStore';
// 5. component
import ImageUploadModal from '@/components/rich/ImageUploadModal.tsx';
import LinkUploadModal from '@/components/rich/LinkUploadModal.tsx';
import CodeEditorWithPreview from '@/components/rich/CodeEditorWithPreview.tsx';
import FileUploadModal from '@/components/rich/FileUploadModal.tsx';
// 6. image 등 assets
import { TNote } from '@/types/types.ts';
import DraggableIcon from '@/assets/icons/draggable.svg?react';
import BubbleMenuBar from '@/components/rich/BubbleMenuBar.tsx';
// import useUserStore from '@/stores/userStore.ts';
const { VITE_SCREENSHOT_API, VITE_TIPTAP_APP_ID } = import.meta.env;

interface NoteProps {
  note: TNote;
  projectId: number;
  requirementId: number;
  onEditorUpdate: (
    editor: TiptapEditor,
    transaction: Transaction,
    noteId: string,
  ) => void;
}

const Note = ({
  note,
  projectId,
  requirementId,
  onEditorUpdate,
}: NoteProps) => {
  // useState
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] =
    useState<boolean>(false);
  const [isLinkUploadModalOpen, setIsLinkUploadModalOpen] =
    useState<boolean>(false);
  const [linkTabType, setLinkTabType] = useState<string>('');
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] =
    useState<boolean>(false);
  // useStore
  // const { name, profileColor } = useUserStore();
  const { isCodeModalOpen, openCodePreviewModal, closeCodePreviewModal } =
    useRichStore();
  const projectName = '브레드 이발소  단장 프로젝트';
  const requirementName = '좋아요 기능';

  // 공동 편집
  const doc = new Y.Doc();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const provider = new TiptapCollabProvider({
      name: `${projectId}${projectName}/${requirementId}${requirementName}/${note.id}`,
      appId: VITE_TIPTAP_APP_ID,
      token: accessToken,
      document: doc,
    });

    return () => {
      provider.destroy();
    };
  }, [note.id]);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'm-2 p-2',
      },
    },
    extensions: [
      ...extensions,
      FileHandler.configure({
        onPaste: async (editor, files) => {
          for (const file of files) {
            if (file.type.startsWith('image/')) {
              try {
                const imageUrl = await getImageUrl(file, requirementId);
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
                const fileUrl = await getFileUrl(file, requirementId);
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
                const imageUrl = await getImageUrl(file, requirementId);
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
                const fileUrl = await getFileUrl(file, requirementId);
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
    content: `<p></p>`,
    onUpdate: ({ editor, transaction }) =>
      onEditorUpdate(editor as TiptapEditor, transaction, note.id),
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

  return (
    <>
      <div className='col-span-10 col-start-2'>
        <EditorContent editor={editor}>
          <DraggableIcon />
        </EditorContent>
        <BubbleMenu>
          <BubbleMenuBar />
        </BubbleMenu>
        <ImageUploadModal
          isOpen={isImageUploadModalOpen}
          onClose={() => setIsImageUploadModalOpen(false)}
          onInsert={handleImageInsert}
          requirementId={requirementId}
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
          requireUniqueId={requirementId}
        />
      </div>
      {isCodeModalOpen && (
        <CodeEditorWithPreview
          isOpen={isCodeModalOpen}
          applyCodeCapture={captureCodeImage}
          requirementId={requirementId}
        />
      )}
    </>
  );
};

export default Note;
