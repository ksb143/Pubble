// 1. react 관련
import { useState } from 'react';
import { useParams } from 'react-router-dom';
// 2. library
import { v4 as uuidv4 } from 'uuid';
import { Editor as TiptapEditor } from '@tiptap/react';
import { Transaction } from 'prosemirror-state';
// 3. api
// 4. store
// import useUserStore from '@/stores/userStore.ts';
// 5. component
import MenuBar from '@/components/rich/MenuBar.tsx';
import Node from '@/components/rich/Node.tsx';
// 6. image 등 assets
import { TNote } from '@/types/types.ts';
import AddLineIcon from '@/assets/icons/add-line.svg?react';
import './RichPage.css';

// 이니셜 노트
const initialNotes: TNote[] = Array.from({ length: 20 }, (_, index) => ({
  id: uuidv4(),
  title: `Note ${index + 1}`,
  defaultContent: '',
}));

const RichPage = () => {
  // useState
  const [notes, setNotes] = useState<TNote[]>(initialNotes);
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] =
    useState<boolean>(false);
  const [isLinkUploadModalOpen, setIsLinkUploadModalOpen] =
    useState<boolean>(false);
  const [linkTabType, setLinkTabType] = useState<string>('');
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] =
    useState<boolean>(false);
  const [activeNoteId, setActiveNoteId] = useState(notes[0].id);
  const [activeEditor, setActiveEditor] = useState<TiptapEditor | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  // useStore
  const projectName = '브레드 이발소  단장 프로젝트';
  const requirementName = '좋아요 기능';

  // params
  const { projectCode, requirementCode } = useParams<{
    projectCode?: string;
    requirementCode?: string;
  }>();
  const projectIdNumber = Number(projectCode);
  const requirementIdNumber = Number(requirementCode);

  // 특정 노드 확인 함수
  const handleEditorUpdate = (
    editor: TiptapEditor,
    transaction: Transaction,
    noteId: string,
  ) => {
    setActiveEditor(editor);
    setActiveNoteId(noteId);
    setTransaction(transaction);
  };

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
        {activeEditor && (
          <MenuBar
            editor={activeEditor || null}
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
        )}
      </div>
      <div className='col-span-10 col-start-2 mb-4 rounded-b bg-white shadow-custom'>
        {notes.map((note) => (
          <Node
            key={note.id}
            note={note}
            notes={notes}
            setNotes={setNotes}
            projectId={projectIdNumber}
            requirementId={requirementIdNumber}
            onEditorUpdate={handleEditorUpdate}
            setActiveEditor={setActiveEditor}
            isImageUploadModalOpen={isImageUploadModalOpen}
            linkTabType={linkTabType}
            isLinkUploadModalOpen={isLinkUploadModalOpen}
            isFileUploadModalOpen={isFileUploadModalOpen}
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
