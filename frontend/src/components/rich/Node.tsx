// 1. react 관련
import React, { useEffect, useState } from 'react';
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
// import useUserStore from '@/stores/userStore.ts';
// 5. component
import BubbleMenuBar from '@/components/rich/BubbleMenuBar.tsx';
import ImageUploadModal from '@/components/rich/ImageUploadModal.tsx';
import LinkUploadModal from '@/components/rich/LinkUploadModal.tsx';
import CodeEditorWithPreview from '@/components/rich/CodeEditorWithPreview.tsx';
import FileUploadModal from '@/components/rich/FileUploadModal.tsx';
// 6. image 등 assets
import DraggableIcon from '@/assets/icons/draggable.svg?react';
import { TNote } from '@/types/types.ts';
const { VITE_SCREENSHOT_API, VITE_TIPTAP_APP_ID } = import.meta.env;

interface NoteProps {
  note: TNote;
  notes: TNote[];
  setNotes: React.Dispatch<React.SetStateAction<TNote[]>>;
  projectId: number;
  requirementId: number;
  onEditorUpdate: (
    editor: TiptapEditor,
    transaction: Transaction,
    noteId: string,
  ) => void;
  setActiveEditor: (editor: TiptapEditor) => void;
  isImageUploadModalOpen: boolean;
  isLinkUploadModalOpen: boolean;
  isFileUploadModalOpen: boolean;
  linkTabType: string;
}

const Node = ({
  note,
  notes,
  setNotes,
  projectId,
  requirementId,
  onEditorUpdate,
  setActiveEditor,
  isImageUploadModalOpen,
  isLinkUploadModalOpen,
  isFileUploadModalOpen,
  linkTabType,
}: NoteProps) => {
  // useState
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [openImageUploadModal, setOpenImageUploadModal] = useState<boolean>(
    isImageUploadModalOpen,
  );
  const [openLinkUploadModal, setOpenLinkUploadModal] = useState<boolean>(
    isLinkUploadModalOpen,
  );
  const [openFileUploadModal, setOpenFileUploadModal] = useState<boolean>(
    isFileUploadModalOpen,
  );

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

  // 에디터 설정
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'p-2 mx-8 focus:outline-none',
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
    content: note.defaultContent,
    onCreate: ({ editor }) => {
      setActiveEditor(editor as TiptapEditor);
    },
    onUpdate: ({ editor, transaction }) => {
      onEditorUpdate(editor as TiptapEditor, transaction, note.id);
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

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
    setOpenImageUploadModal(false);
  };

  // 파일 삽입 함수
  const handleFileInsert = (fileUrl: string, fileName: string) => {
    const linkHtml = `<a href="${fileUrl}" target="_blank" download="${fileName}">${fileName}</a>`;
    editor?.chain().focus().insertContent(linkHtml).run();
    setOpenFileUploadModal(false);
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
    setOpenLinkUploadModal(false);
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

  // 노드 드래그 시작 함수
  const handleDragStart = (event: React.DragEvent, noteId: string) => {
    setIsDragging(true);
    event.dataTransfer.setData('application/vnd.yourapp.note', noteId);
  };

  // 노드 드래그 타겟 위로 이동될 때 호출 함수
  const handleDrop = (event: React.DragEvent, targetNoteId: string) => {
    event.preventDefault();
    const draggedNoteId = event.dataTransfer.getData(
      'application/vnd.yourapp.note',
    );
    if (draggedNoteId !== targetNoteId) {
      switchNotes(draggedNoteId, targetNoteId);
    }
  };

  // 노드 드래그 타겟 위로 이동될 때 호출 핸들러
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // 노드 드래그 종료 함수
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 노드 위치 교환 로직
  const switchNotes = (draggedNoteId: string, targetNoteId: string) => {
    const newNotes = [...notes];
    const draggedIndex = newNotes.findIndex(
      (note) => note.id === draggedNoteId,
    );
    const targetIndex = newNotes.findIndex((note) => note.id === targetNoteId);

    if (draggedIndex < 0 || targetIndex < 0) return; // 드래그 또는 타겟 인덱스가 유효하지 않은 경우 early return

    [newNotes[draggedIndex], newNotes[targetIndex]] = [
      newNotes[targetIndex],
      newNotes[draggedIndex],
    ];
    setNotes(newNotes);
  };

  return (
    <>
      <div
        id={`editor-${note.id}`}
        className='group relative col-span-10 col-start-2 px-4 py-2'
        onDrop={(event) => handleDrop(event, note.id)}
        onDragOver={handleDragOver}
        onDragStart={(event) => handleDragStart(event, note.id)}
        onDragEnd={handleDragEnd}>
        <div
          className='absolute left-3.5 top-3.5 cursor-move opacity-0 group-hover:opacity-100'
          draggable='true'>
          <DraggableIcon
            className='h-7 w-7 fill-gray-200'
            aria-label='Drag handle'
          />
        </div>
        <EditorContent
          className={`${isDragging ? 'border-b-4 border-gray-200' : ''}`}
          editor={editor}></EditorContent>
        <BubbleMenu
          editor={editor || undefined}
          tippyOptions={{ placement: 'bottom' }}>
          <BubbleMenuBar />
        </BubbleMenu>
        <ImageUploadModal
          isOpen={openImageUploadModal}
          onClose={() => setOpenImageUploadModal(false)}
          onInsert={handleImageInsert}
          requirementId={requirementId}
        />
        <LinkUploadModal
          tabType={linkTabType}
          isOpen={openLinkUploadModal}
          onClose={() => setOpenLinkUploadModal(false)}
          onInsert={handleLinkInsert}
        />
        <FileUploadModal
          isOpen={openFileUploadModal}
          onClose={() => setOpenFileUploadModal(false)}
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

export default Node;
