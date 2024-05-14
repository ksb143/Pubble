// 1. react 관련
import { useEffect, useState } from 'react';
// 2. library
import { EditorContent, useEditor } from '@tiptap/react';
import { Extensions } from '@/extensions/Extensions.ts';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { SignJWT } from 'jose';
// 3. api
// 4. store
import useUserStore from '@/stores/userStore.ts';
import usePageInfoStore from '@/stores/pageInfoStore.ts';
// 5. component
import MenuBar from '@/components/rich/MenuBar.tsx';
// 6. image 등 assets
const { VITE_TIPTAP_APP_ID, VITE_TIPTAP_API_SECRET } = import.meta.env;

const RichEditorPage = () => {
  const { name, profileColor, allowedDocumentNames } = useUserStore();
  const {
    projectId,
    projectName,
    requirementId,
    requirementCode,
    requirementName,
  } = usePageInfoStore();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('connecting');
  const [jwt, setJwt] = useState('');
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
  const currentUser = loading ? null : { name: name, color: profileColor };
  const ydoc = new Y.Doc();

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: ``,
      },
    },
    extensions: [
      ...Extensions,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
      }),
    ],
  });

  // 스토어 값 감지
  useEffect(() => {
    if (
      name &&
      profileColor &&
      projectId &&
      requirementId &&
      requirementCode &&
      requirementName
    ) {
      setLoading(false);
    }
  }, [
    name,
    profileColor,
    projectId,
    requirementId,
    requirementCode,
    requirementName,
  ]);

  // jwt 생성
  useEffect(() => {
    const generateJwt = async (userId: string) => {
      if (VITE_TIPTAP_API_SECRET) {
        const payload = {
          userId: userId,
          allowedDocumentNames: allowedDocumentNames,
        };
        const newJtw = await new SignJWT({
          payload,
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('1h')
          .sign(new TextEncoder().encode(VITE_TIPTAP_API_SECRET));
        setJwt(newJtw);
      }
    };
    const userId = localStorage.getItem('userId');
    if (userId) {
      generateJwt(userId);
    }
  }, []);

  // provider 설정
  useEffect(() => {
    if (editor && jwt) {
      const collabProvider = new TiptapCollabProvider({
        appId: VITE_TIPTAP_APP_ID,
        name: `${projectId}/${requirementId}/${requirementCode}-${requirementName}`,
        document: ydoc,
        token: jwt,
      });

      setProvider(collabProvider);

      return () => {
        collabProvider.destroy();
      };
    }
  }, []);

  // 상태값 감지
  useEffect(() => {
    if (provider) {
      provider.on('status', (event: { status: string }) => {
        console.log(event);
        setStatus(event.status);
      });
    }
  }, []);

  // 현재 접속 유저 감지
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      editor.chain().focus().updateUser(currentUser).run();
    }
  }, [editor, currentUser]);

  return (
    <div className='mx-32 my-4 flex h-[40rem] flex-col rounded border-2 border-gray-200 bg-white text-white'>
      {editor && (
        <MenuBar
          editor={editor}
          projectName={projectName}
          requirementCode={requirementCode}
          requirementName={requirementName}
        />
      )}
      <EditorContent
        className='flex shrink grow overflow-y-auto overflow-x-hidden px-5 py-4'
        editor={editor}
      />
      <div className='flex max-h-8 shrink grow flex-wrap items-center whitespace-nowrap border-t-2 border-gray-200 bg-white'>
        <div className='px-4'>
          <span
            className={`mr-4 h-4 w-4 rounded-full ${status === 'connected' ? 'bg-pubble' : 'bg-gray-400'}`}></span>
          {status === 'connected' ? (
            <span>
              {editor?.storage.collaborationCursor.users.length} 명의 유저가 이
              문서에 있습니다.
            </span>
          ) : (
            <span>오프라인</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichEditorPage;
