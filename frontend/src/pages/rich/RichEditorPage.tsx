// 1. react 관련
import { useEffect, useState, useCallback } from 'react';
// 2. library
import { EditorContent, useEditor } from '@tiptap/react';
import { Extensions } from '@/extensions/Extensions.ts';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import CollaborationHistory from '@tiptap-pro/extension-collaboration-history'
import { CollabHistoryVersion } from '@tiptap-pro/extension-collaboration-history';
import { SignJWT } from 'jose';
import * as Y from 'yjs';
import { Switch } from "@/components/ui/switch"
// 3. api
// 4. store
import useUserStore from '@/stores/userStore.ts';
import usePageInfoStore from '@/stores/pageInfoStore.ts';
// 5. component
import MenuBar from '@/components/rich/MenuBar.tsx';
import VersioningModal from '@/components/rich/VersioningModal.tsx';
// 6. image 등 assets
const { VITE_TIPTAP_APP_ID, VITE_TIPTAP_APP_SECRET } = import.meta.env;
import { renderDate } from '@/utils/tiptap.ts';


const RichEditorPage = () => {
  const { name, profileColor } = useUserStore();
  const {
    projectId,
    projectName,
    projectCode,
    requirementId,
    requirementCode,
    requirementName,
  } = usePageInfoStore();
  const [loading, setLoading] = useState(true);
  const [tiptapToken, setTiptapToken] = useState('');
  const [status, setStatus] = useState('connecting');
  const [currentVersion, setCurrentVersion] = useState(0);
  const [latestVersion, setLatestVersion] = useState(0);
  const [versions, setVersions] = useState<CollabHistoryVersion[]>([]);
  const [isAutoVersioning, setIsAutoVersioning] = useState(false)
  const [versioningModalOpen, setVersioningModalOpen] = useState(false)

  // 공동편집 기능 사용
  useEffect(() => {
    const generateJwt = async () => {
      try {
        const userId = await localStorage.getItem('userId');
        const newToken = await new SignJWT({ userId: userId })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('2h')
          .sign(new TextEncoder().encode(VITE_TIPTAP_APP_SECRET));
        setTiptapToken(newToken);
      } catch (error) {
        console.error('JWT 생성 오류:', error);
      }
    };
    generateJwt();
  }, []);

  // 웹소켓 프로바이더 설정
  const ydoc = new Y.Doc();
  const websocketProvider = new TiptapCollabProvider({
    appId: VITE_TIPTAP_APP_ID,
    name: `${projectId}/${projectCode}/${requirementId}/${requirementCode}`,
    document: ydoc,
    token: tiptapToken,
    onAuthenticationFailed(reason) {
      console.log("인증 실패: ", reason);
    },
    onSynced(isSynced) {
      console.log('문서 동기화 상태:', isSynced)
    }
  });
  websocketProvider.setAwarenessField("user", {
    name: name,
    color: profileColor,
  })

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'm-2 p-2 border border-gray-200 rounded-lg focus:outline-none',
      },
    },
    extensions: [
      ...Extensions,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: websocketProvider,
        user: {
          name: name,
          color: profileColor,
        }
      }),
      CollaborationHistory.configure({
        provider: websocketProvider,
        onUpdate: data => {
          setVersions(data.versions)
          setCurrentVersion(data.currentVersion)
          setLatestVersion(data.version)
          setIsAutoVersioning(data.versioningEnabled)
        }
      }),
    ],
  })

  // 버전 복구
  const handleRevert = useCallback((version: number, versionData?: CollabHistoryVersion) => {
    if (versionData) {
      const versionTitle = versionData.name || renderDate(versionData.date);
      editor?.commands.revertToVersion(version, `Revert to ${versionTitle}`, `Unsaved changes before revert to ${versionTitle}`);
    } else {
      const defaultTitle = `Version ${version}`;
      editor?.commands.revertToVersion(version, `Revert to ${defaultTitle}`, `Unsaved changes before revert to ${defaultTitle}`);
    }
  }, [editor]);

  // 버전 관리 모달
  const showVersioningModal = useCallback(() => {
    setVersioningModalOpen(true)
  }, [])
  const handleVersioningClose = useCallback(() => {
    setVersioningModalOpen(false)
  }, [])
  const currentUser = loading ? null : { name: name, color: profileColor };

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

  // 상태값 감지
  useEffect(() => {
    if (websocketProvider) {
      websocketProvider.on('status', (event: { status: string }) => {
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
    <div className='mx-32 my-4 flex h-[40rem] flex-col rounded border-2 border-gray-200 bg-white'>
      <VersioningModal
        versions={versions}
        isOpen={versioningModalOpen}
        onClose={handleVersioningClose}
        onRevert={handleRevert}
        currentVersion={currentVersion}
        latestVersion={latestVersion}
        provider={websocketProvider}
      />
      {editor && (
        <MenuBar
          editor={editor}
          projectName={projectName}
          requirementCode={requirementCode}
          requirementName={requirementName}
        />
      )}
      <EditorContent
        className='flex grow shrink overflow-y-auto overflow-x-hidden px-5 py-4'
        editor={editor}
      />
      <div className='px-4 flex max-h-12 shrink grow flex-wrap justify-between items-center whitespace-nowrap border-t-2 border-gray-200 bg-white'>
        <div className='flex items-center gap-2'>
          <div
            className={`mr-4 h-2 w-2 rounded-full ${status === 'connected' ? 'bg-pubble' : 'bg-gray-400'}`}></div>
          <div>{status === 'connected' ? `${editor?.storage.collaborationCursor.users.length} 명의 유저가 이
            문서에 있습니다.` : '오프라인'}</div>
        </div>
        <div className='flex items-center gap-4'>
            <Switch checked={isAutoVersioning} onCheckedChange={() => editor?.commands.toggleVersioning()}  />
            <div>{isAutoVersioning ? 'ON' : 'OFF'}</div>
          <button className='text-xs bg-plblue rounded p-2 text-gray-800 hover:bg-pubble hover:text-white' onClick={showVersioningModal}>버전 히스토리 확인</button>
        </div>
      </div>
    </div>
  );
};

export default RichEditorPage;
