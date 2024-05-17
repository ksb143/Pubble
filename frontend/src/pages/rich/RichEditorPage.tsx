// 1. react 관련
import { useEffect, useState, useCallback, useMemo } from 'react';
// 2. library
import { EditorContent, useEditor, BubbleMenu } from '@tiptap/react';
import { Extensions } from '@/extensions/Extensions.ts';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import CollaborationHistory from '@tiptap-pro/extension-collaboration-history';
import { CollabHistoryVersion } from '@tiptap-pro/extension-collaboration-history';
import * as Y from 'yjs';
import styled from '@emotion/styled';
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
import { Switch } from '@/components/ui/switch';
// 6. image 등 assets
import { renderDate } from '@/utils/tiptap.ts';
import './RichEditorPage.css';
import BoldIcon from '@/assets/icons/bold.svg?react';
import ItalicIcon from '@/assets/icons/italic.svg?react';
import UnderlineIcon from '@/assets/icons/underline.svg?react';
import StrikeIcon from '@/assets/icons/strikethrough.svg?react';
import PaletteIcon from '@/assets/icons/palette-line.svg?react';
import MarkPenIcon from '@/assets/icons/mark-pen-line.svg?react';
const { VITE_TIPTAP_APP_ID } = import.meta.env;

// 컬러팔레트 커스텀
const ColorInput = styled.input`
  width: 10px; // 너비 설정
  height: 14px; // 높이 설정
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;

  &::-webkit-color-swatch {
    border-radius: 50%;
    border: none;
  }
`;

// 하이라이트 커스텀
const HighlightInput = styled.input`
  width: 10px; // 너비 설정
  height: 14px; // 높이 설정
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;

  &::-webkit-color-swatch {
    border-radius: 50%;
    border: none;
  }
`;

interface RichEditorPageProps {
  tiptapToken: string;
}

const RichEditorPage = ({ tiptapToken }: RichEditorPageProps) => {
  const { name, profileColor } = useUserStore();
  const {
    projectCode,
    projectName,
    requirementCode,
    requirementName,
    setPageType,
  } = usePageInfoStore();
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

  // 공동편집 기능 및 리치에디터 전역변수 설정
  useEffect(() => {
    setPageType('rich', {
      isRichPage: true,
    });
  }, []);

  const ydoc = new Y.Doc();

  const provider = useMemo(
    () =>
      new TiptapCollabProvider({
        appId: VITE_TIPTAP_APP_ID,
        name: `${projectCode}-${requirementCode}`,
        document: ydoc,
        token: tiptapToken,
        onDisconnect() {
          console.log('연결 끊김');
        },
        onAuthenticationFailed({ reason }: { reason: string }) {
          console.error('인증 실패: ', reason);
        },
      }),
    [tiptapToken, ydoc],
  );

  // 현재 사용자 정보 설정
  useEffect(() => {
    provider.setAwarenessField('user', {
      name: name,
      color: profileColor,
    });
  }, [name, profileColor]);

  // 접속 상태 확인
  useEffect(() => {
    const statusHandler = ({ status }: { status: string }) => {
      setStatus(status);
    };
    provider.on('status', statusHandler);
    return () => {
      provider.off('status', statusHandler);
    };
  }, []);

  // 공급자 이벤트 리스너 파괴 설정
  useEffect(() => {
    return () => {
      provider.off('disconnect');
      provider.off('authentication-failed');
      provider.destroy();
    };
  }, []);

  // 에디터 설정
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          'm-2 p-4 w-full border border-gray-200 rounded-lg focus:outline-none overflow-y-auto overflow-x-hidden',
      },
    },
    extensions: provider
      ? [
          ...Extensions,
          Collaboration.configure({
            document: ydoc,
          }),
          CollaborationCursor.configure({
            provider: provider,
          }),
          CollaborationHistory.configure({
            provider: provider,
            onUpdate: (payload) => {
              setVersions(payload.versions);
              setCurrentVersion(payload.currentVersion);
              setLatestVersion(payload.version);
              setIsAutoVersioning(payload.versioningEnabled);
            },
          }),
        ]
      : [...Extensions],
  });

  // 버전 복구
  const handleRevert = useCallback(
    (version: number, versionData?: CollabHistoryVersion) => {
      const versionTitle = versionData
        ? versionData.name || renderDate(new Date(versionData.date))
        : version;
      editor?.commands.revertToVersion(
        version,
        `Revert to ${versionTitle}`,
        `Unsaved changes before revert to ${versionTitle}`,
      );
    },
    [editor],
  );

  // 현재 접속 유저 감지
  useEffect(() => {
    if (editor && name && profileColor) {
      editor
        .chain()
        .focus()
        .updateUser({ name: name, color: profileColor })
        .run();
    }
  }, [editor, name, profileColor]);

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
      {provider && (
        <VersioningModal
          versions={versions}
          isOpen={versioningModalOpen}
          onClose={handleVersioningClose}
          onRevert={handleRevert}
          currentVersion={currentVersion}
          latestVersion={latestVersion}
          provider={provider}
        />
      )}
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
      {editor && (
        <BubbleMenu
          className='z-10 flex gap-2 rounded border border-gray-200 bg-white px-4 py-1 shadow-custom'
          editor={editor}
          tippyOptions={{ duration: 100 }}>
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            <BoldIcon className='h-5 w-5' />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            <ItalicIcon className='h-5 w-5' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className='h-5 w-5' />
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()}>
            <StrikeIcon className='h-5 w-5' />
          </button>
          <label className='flex w-7 cursor-pointer items-end'>
            <PaletteIcon className='h-5 w-5 fill-gray-800' />
            <ColorInput
              type='color'
              onInput={(event) => {
                const target = event.target as HTMLInputElement; // 타입 단언 추가
                editor.chain().focus().setColor(target.value).run();
              }}
              value={editor.getAttributes('textStyle').color}
              data-testid='setColor'
            />
          </label>
          <label className='flex w-7 cursor-pointer items-end'>
            <MarkPenIcon className='h-5 w-5 fill-gray-800' />
            <HighlightInput
              type='color'
              onInput={(event) => {
                const target = event.target as HTMLInputElement; // 타입 단언 추가
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: target.value })
                  .run();
              }}
              value={editor.getAttributes('textStyle').highlight}
              data-testid='setColor'
            />
          </label>
        </BubbleMenu>
      )}
      <EditorContent
        className='flex shrink grow overflow-y-auto overflow-x-hidden px-5 py-4'
        editor={editor}
      />
      <div className='flex max-h-12 shrink grow flex-wrap items-center justify-between whitespace-nowrap border-t-2 border-gray-200 bg-white px-4'>
        <div className='flex items-center gap-2'>
          <div
            className={`mr-4 h-2 w-2 rounded-full ${status === 'connected' || (editor?.storage?.collaborationCursor?.users?.length > 0 ?? false) ? 'bg-pubble' : 'bg-gray-400'}`}></div>
          <div>
            {status === 'connected' ||
            (editor?.storage?.collaborationCursor?.users?.length > 0 ?? false)
              ? `${editor?.storage.collaborationCursor.users.length} 명의 유저가 이 문서에 있습니다.`
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
