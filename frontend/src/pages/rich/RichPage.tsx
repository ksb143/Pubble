// 1. react 관련
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// 2. library
import { v4 as uuidv4 } from 'uuid';
import {
  BubbleMenu,
  useEditor,
  EditorContent,
  Editor as TiptapEditor,
} from '@tiptap/react';
import { extensions } from '@/extensions/Extensions';
import FileHandler from '@tiptap-pro/extension-file-handler';
import Collaboration from '@tiptap/extension-collaboration';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
// 3. api
import { getFileUrl, getImageUrl } from '@/apis/rich.ts';
// 4. store
import useUserStore from '@/stores/userStore.ts';
import useRichStore from '@/stores/richStore';
// 5. component
import MenuBar from '@/components/rich/MenuBar.tsx';
import Node from '@/components/rich/Node.tsx';
// 6. image 등 assets
import AddLineIcon from '@/assets/icons/add-line.svg?react';
import { TNote } from '@/types/types.ts';
import './RichPage.css';
// 7. 환경변수
const { VITE_SCREENSHOT_API, VITE_TIPTAP_APP_ID } = import.meta.env;

// 이니셜 노트
const initialNotes: TNote[] = Array.from({ length: 20 }, (_, index) => ({
  id: uuidv4(),
  title: `Note ${index + 1}`,
  defaultContent: '',
}));

const RichPage = () => {
  // params
  const { projectCode, requirementCode } = useParams<{
    projectCode?: string;
    requirementCode?: string;
  }>();

  // useStore
  const { isCodeModalOpen, openCodePreviewModal, closeCodePreviewModal } =
    useRichStore();
  const projectName = '브레드 이발소  단장 프로젝트';
  const requirementName = '좋아요 기능';

  // yjs
  const doc = new Y.Doc();

  // 기본 에디터 설정
  const editor = useEditor({
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
                console.error('Image upload failed: ', error);
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
  });

  // 공동 편집
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    const provider = new TiptapCollabProvider({
      name: `${projectCode}${projectName}/${requirementCode}${requirementName}/${note.id}`,
      appId: VITE_TIPTAP_APP_ID,
      token: accessToken,
      document: doc,
    });
    return () => {
      provider.destroy();
    };
  }, [editor]);

  // 노드 추가
  const addNewNote = () => {
    const newNote = {
      id: uuidv4(),
      title: `Note ${notes.length + 1}`,
      defaultContent: '',
    };
    setNotes([...notes, newNote]);
  };

  // 에디터가 있을 경우
  return (
    <div className='mx-12 mt-10 grid grid-cols-12'>
      <div className='col-span-10 col-start-2 rounded-t bg-white shadow-custom'>
        <MenuBar
          editor={editor}
          requirementCode={requirementCode || ''}
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
      <div className='col-span-10 col-start-2 mb-4 rounded-b bg-white shadow-custom'>
        {initialNotes.map((note) => (
          <Node
            key={note.id}
            note={note}
            editor={editor} // 모든 Node 컴포넌트에 같은 에디터 인스턴스를 전달
          />
        ))}
        <button
          className='mt-4 flex w-full justify-center rounded bg-gray-100 py-2 text-center'
          onClick={addNewNote}>
          <AddLineIcon className='h-6 w-6 fill-gray-200' />
        </button>
      </div>
    </div>
  );
};

export default RichPage;
