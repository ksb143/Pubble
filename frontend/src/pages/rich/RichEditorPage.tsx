// 1. react 관련
import { useEffect, useState, useCallback } from 'react';
// 2. library
import { EditorContent, useEditor } from '@tiptap/react';
import { Extensions } from '@/extensions/Extensions.ts';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import CollaborationHistory from '@tiptap-pro/extension-collaboration-history';
import { CollabHistoryVersion } from '@tiptap-pro/extension-collaboration-history';
import { SignJWT } from 'jose';
import * as Y from 'yjs';
import { Switch } from '@/components/ui/switch';
// 3. api
// 4. store
import useUserStore from '@/stores/userStore.ts';
import usePageInfoStore from '@/stores/pageInfoStore.ts';
// 5. component
import MenuBar from '@/components/rich/MenuBar.tsx';
import VersioningModal from '@/components/rich/VersioningModal.tsx';
import CodeEditorWithPreview from '@/components/rich/CodeEditorWithPreview.tsx';
import ImageUploadModal from '@/components/rich/ImageUploadModal.tsx';
import FileUploadModal from '@/components/rich/FileUploadModal.tsx';
import LinkUploadModal from '@/components/rich/LinkUploadModal.tsx';
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
  const [isAutoVersioning, setIsAutoVersioning] = useState(false);
  const [versioningModalOpen, setVersioningModalOpen] = useState(false);
  const [codeEditorWithPreviewOpen, setCodeEditorWithPreviewOpen] =
    useState(false);
  const [codePreview, setCodePreview] = useState({
    html: '',
    css: '',
    javascript: '',
  });
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);
  const [imageUploadModalOpen, setImageUploadModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);

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
      console.log('인증 실패: ', reason);
    },
  });
  websocketProvider.setAwarenessField('user', {
    name: name,
    color: profileColor,
  });

  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          'm-2 p-4 w-full border border-gray-200 rounded-lg focus:outline-none overflow-y-auto overflow-x-hidden',
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
        },
      }),
      CollaborationHistory.configure({
        provider: websocketProvider,
        onUpdate: (data) => {
          setVersions(data.versions);
          setCurrentVersion(data.currentVersion);
          setLatestVersion(data.version);
          setIsAutoVersioning(data.versioningEnabled);
        },
      }),
    ],
  });

  // 버전 복구
  const handleRevert = useCallback(
    (version: number, versionData?: CollabHistoryVersion) => {
      if (versionData) {
        const versionTitle =
          versionData.name || renderDate(new Date(versionData.date));
        editor?.commands.revertToVersion(
          version,
          `Revert to ${versionTitle}`,
          `Unsaved changes before revert to ${versionTitle}`,
        );
      } else {
        const defaultTitle = `Version ${version}`;
        editor?.commands.revertToVersion(
          version,
          `Revert to ${defaultTitle}`,
          `Unsaved changes before revert to ${defaultTitle}`,
        );
      }
    },
    [editor],
  );

  // 현재 접속 유저 판단
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
  }, [websocketProvider]);

  // 현재 접속 유저 감지
  useEffect(() => {
    if (editor && currentUser) {
      editor.chain().focus().updateUser(currentUser).run();
    }
  }, [editor, currentUser, websocketProvider]);

  // 버전 관리 모달
  const showVersioningModal = useCallback(() => {
    setVersioningModalOpen(true);
  }, []);
  const handleVersioningClose = useCallback(() => {
    setVersioningModalOpen(false);
  }, []);

  // 코드 프리뷰 모달
  const showCodeEditorWithPreview = useCallback(() => {
    setCodeEditorWithPreviewOpen(true);
  }, []);
  const handleCodeEditorWithPreviewClose = useCallback(() => {
    setCodeEditorWithPreviewOpen(false);
  }, []);
  const applyCodeCapture = useCallback(
    (imageDataUrl: string, html: string, css: string, javascript: string) => {
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
    },
    [editor],
  );
  useEffect(() => {
    const handleCodeImageClick = (event: CustomEvent) => {
      const { html, css, javascript } = event.detail;
      setCodePreview({ html, css, javascript });
      showCodeEditorWithPreview();
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
  }, [showCodeEditorWithPreview]);

  // 링크 모달
  const showLinkModal = useCallback(() => {
    setLinkModalOpen(true);
  }, []);
  const handleLinkModalClose = useCallback(() => {
    setLinkModalOpen(false);
  }, []);
  const handleLinkInsert = async (link: string, linkType: string) => {
    if (linkType === 'link') {
      editor?.chain().focus().setLink({ href: link, target: '_blank' }).run();
    } else if (linkType === 'webImage') {
      editor
        ?.chain()
        .focus()
        .setResizableImage({ src: link, width: 300 })
        .run();
    }
  };

  // 파일 업로드 모달
  const showFileUploadModal = useCallback(() => {
    setFileUploadModalOpen(true);
  }, []);
  const handleFileUploadModalClose = useCallback(() => {
    setFileUploadModalOpen(false);
  }, []);
  const handleFileInsert = useCallback(
    (fileUrl: string, fileName: string) => {
      const linkHtml = `<a href="${fileUrl}" target="_blank" download="${fileName}">${fileName}</a>`;
      editor?.chain().focus().insertContent(linkHtml).run();
    },
    [editor],
  );

  // 이미지 업로드 모달
  const showImageUploadModal = useCallback(() => {
    setImageUploadModalOpen(true);
  }, []);
  const handleImageUploadModalClose = useCallback(() => {
    setImageUploadModalOpen(false);
  }, []);
  const handleImageInsert = (image: string) => {
    editor?.chain().focus().setResizableImage({ src: image, width: 300 }).run();
  };

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
      <CodeEditorWithPreview
        codePreview={codePreview}
        isOpen={codeEditorWithPreviewOpen}
        onClose={handleCodeEditorWithPreviewClose}
        applyCodeCapture={applyCodeCapture}
      />
      <FileUploadModal
        isOpen={fileUploadModalOpen}
        onClose={handleFileUploadModalClose}
        onInsert={handleFileInsert}
      />
      <ImageUploadModal
        isOpen={imageUploadModalOpen}
        onClose={handleImageUploadModalClose}
        onInsert={handleImageInsert}
      />
      <LinkUploadModal
        isOpen={linkModalOpen}
        onClose={handleLinkModalClose}
        onInsert={handleLinkInsert}
      />
      {editor && (
        <MenuBar
          editor={editor}
          projectName={projectName}
          requirementCode={requirementCode}
          requirementName={requirementName}
          openCodeEditorWithPreviewModal={showCodeEditorWithPreview}
          openLinkModal={showLinkModal}
          openFileModal={showFileUploadModal}
          openImageModal={showImageUploadModal}
        />
      )}
      <EditorContent
        className='flex shrink grow overflow-y-auto overflow-x-hidden px-5 py-4'
        editor={editor}
      />
      <div className='flex max-h-12 shrink grow flex-wrap items-center justify-between whitespace-nowrap border-t-2 border-gray-200 bg-white px-4'>
        <div className='flex items-center gap-2'>
          <div
            className={`mr-4 h-2 w-2 rounded-full ${status === 'connected' ? 'bg-pubble' : 'bg-gray-400'}`}></div>
          <div>
            {status === 'connected'
              ? `${editor?.storage.collaborationCursor.users.length} 명의 유저가 이
            문서에 있습니다.`
              : '오프라인'}
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <Switch
            checked={isAutoVersioning}
            onCheckedChange={() => editor?.commands.toggleVersioning()}
          />
          <div>{isAutoVersioning ? 'ON' : 'OFF'}</div>
          <button
            className='rounded bg-plblue p-2 text-xs text-gray-800 hover:bg-pubble hover:text-white'
            onClick={showVersioningModal}>
            버전 히스토리 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default RichEditorPage;
