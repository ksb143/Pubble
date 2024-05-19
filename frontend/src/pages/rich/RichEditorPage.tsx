// 1. react 관련
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  FormEvent,
} from 'react';
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
  const [hasChanges, setHasChanges] = useState(false);
  const [commitDescription, setCommitDescription] = useState('');

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
    [tiptapToken],
  );

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

  // 버전 변경사항 상태 확인
  useEffect(() => {
    const onUpdate = () => {
      setHasChanges(true);
    };
    const onSynced = () => {
      ydoc.on('update', onUpdate);
    };
    provider.on('synced', onSynced);

    return () => {
      provider.off('synced', onSynced);
      ydoc.off('update', onUpdate);
    };
  }, [ydoc]);

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
            user: {
              name: name,
              color: profileColor,
            },
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

  // 버전 관리 모달
  const showVersioningModal = useCallback(() => {
    setVersioningModalOpen(true);
  }, []);
  const handleVersioningClose = useCallback(() => {
    setVersioningModalOpen(false);
  }, []);
  const handleCommitDescriptionChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setCommitDescription(event.target.value);
  };
  const handleNewVersion = useCallback(
    (event: FormEvent<HTMLElement>) => {
      event.preventDefault();
      if (!commitDescription) {
        return;
      }
      editor?.commands.saveVersion(commitDescription);
      setCommitDescription('');
      alert(
        `버전 ${commitDescription}이 생성되었습니다. 버전 히스토리 모달을 확인해주세요!`,
      );
      setHasChanges(false);
    },
    [editor, commitDescription],
  );

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

  if (!editor) {
    return null;
  }

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
            className={`mr-4 h-2 w-2 rounded-full ${status === 'connected' ? 'bg-pubble' : status === 'connecting' ? 'bg-plblue' : 'bg-gray-400'}`}></div>
          <div>
            {status === 'connected'
              ? `${editor.storage.collaborationCursor.users.length} 명의 유저가 이 문서에 있습니다.`
              : status === 'connecting'
                ? '연결 중...'
                : '오프라인'}
          </div>
        </div>
        <div></div>
        <div className='flex items-center gap-4'>
          {!isAutoVersioning && (
            <div>
              <form className='commit-panel'>
                <input
                  className='px-4 py-1'
                  disabled={!hasChanges}
                  type='text'
                  placeholder='버전 이름 설정'
                  value={commitDescription}
                  onChange={handleCommitDescriptionChange}
                />
                <button
                  disabled={!hasChanges || commitDescription.length === 0}
                  className='rounded bg-plblue px-4 py-1 text-white hover:bg-pubble disabled:bg-plblue'
                  type='submit'
                  onClick={handleNewVersion}>
                  Create
                </button>
              </form>
            </div>
          )}
          <Switch
            checked={isAutoVersioning}
            onCheckedChange={() => editor?.commands.toggleVersioning()}
          />
          <div>Auto Save {isAutoVersioning ? 'ON' : 'OFF'}</div>
          <button
            className='p-2 text-sm text-gray-800 hover:text-pubble'
            onClick={showVersioningModal}>
            버전 히스토리 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default RichEditorPage;
