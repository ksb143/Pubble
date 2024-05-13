// 1. react 관련
import { useState } from 'react';
import { useParams } from 'react-router-dom';
// 2. library
import { v4 as uuidv4 } from 'uuid';\
import { Editor as ReactEditor } from '@tiptap/react';
  import { Transaction } from 'prosemirror-state';
// 3. api
// 4. store
import useUserStore from '@/stores/userStore.ts';
// 5. component
import MenuBar from '@/components/rich/MenuBar.tsx';
import Node from '@/components/rich/Node.tsx';
// 6. image 등 assets
import './RichPage.css';

const RichPage = () => {
  // useState
  const [notes, setNotes] = useState([
    { id: uuidv4(), title: 'Note 1' },
    { id: uuidv4(), title: 'Note 2' },
  ]);
  const [activeNoteId, setActiveNoteId] = useState(notes[0].id);
  const [activeEditor, setActiveEditor] = useState(null);
  const [transaction, setTransaction] = useState(null);

  // 파라미터
  const { projectId } = useParams<{ projectId: string }>();
  const projectIdNumber = Number(projectId);
  const { requirementId } = useParams<{ requirementId: string }>();
  const requirementIdNumber = Number(requirementId);

  // 특정 노드 확인 함수
  const handleEditorUpdate = (editor: ReactEditor, transaction: Transaction, noteId: string) => {
    setActiveEditor(editor);
    setActiveNoteId(noteId);
    setTransaction(transaction);
  };

  // 노드 추가
  const addNewNote = () => {
    const newNote = {
      id: uuidv4(),
      title: `Note ${notes.length + 1}`,
    };
    setNotes([...notes, newNote]);
  };

  // 에디터가 있을 경우
  return (
    <div className='mx-12 mt-10 grid grid-cols-12'>
      <div className='col-span-10 col-start-2'>
        <MenuBar
          editor={activeEditor}
          requirementUniqueId={requirementUniqueId}
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
      <div>
        {notes.map((note) => (
          <Node
            key={note.id}
            projectId={projectIdNumber}
            requirementId={requirementIdNumber}
            onEditorUpdate={handleEditorUpdate}
          </Node>
        ))}
      </div>
    </div>
  );
};

export default RichPage;
