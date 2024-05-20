// 1. react 관련
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
// 2. library
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  watchPreviewContent,
  CollabHistoryVersion,
} from '@tiptap-pro/extension-collaboration-history';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Dialog from '@radix-ui/react-dialog';
// 3. api
// 4. store
// 5. component
import VersionItem from '@/components/rich/VersionItem.tsx';
// 6. image 등 assets

const getVersionName = (version: CollabHistoryVersion) => {
  if (version.name) {
    return version.name;
  }

  if (version.version === 0) {
    return 'Initial version';
  }

  return `Version ${version.version}`;
};

interface VersioningModalProps {
  versions: CollabHistoryVersion[];
  isOpen: boolean;
  onClose: () => void;
  onRevert: (
    version: number,
    versionData: CollabHistoryVersion | undefined,
  ) => void;
  currentVersion: number;
  latestVersion: number;
  provider: TiptapCollabProvider;
}

const VersioningModal = memo(
  ({ versions, isOpen, onClose, onRevert, provider }: VersioningModalProps) => {
    const [currentVersionId, setCurrentVersionId] = useState<number | null>(
      null,
    );
    const isCurrentVersion =
      versions && versions.length > 0
        ? currentVersionId === versions.at(-1)?.version
        : false;

    const editor = useEditor({
      editable: false,
      content: '',
      extensions: [StarterKit],
    });

    const reversedVersions = useMemo(
      () => versions.slice().reverse(),
      [versions],
    );

    const handleVersionChange = useCallback(
      (newVersion: number) => {
        setCurrentVersionId(newVersion);

        provider.sendStateless(
          JSON.stringify({
            action: 'version.preview',
            version: newVersion,
          }),
        );
      },
      [provider],
    );

    const versionData = useMemo(() => {
      if (!versions.length) {
        return null;
      }

      return versions.find((v) => v.version === currentVersionId);
    }, [currentVersionId, editor, provider]);

    useEffect(() => {
      if (isOpen && currentVersionId === null && versions.length > 0) {
        const initialVersion = versions.at(-1)?.version ?? null;

        setCurrentVersionId(initialVersion);

        provider.sendStateless(
          JSON.stringify({
            action: 'version.preview',
            version: initialVersion,
          }),
        );
      }
    }, [currentVersionId, versions, isOpen]);

    useEffect(() => {
      if (isOpen) {
        const unbindContentWatcher = watchPreviewContent(
          provider,
          (content) => {
            if (editor) {
              editor.commands.setContent(content);
            }
          },
        );
        return () => {
          unbindContentWatcher();
        };
      }
    }, [isOpen, provider, editor]);

    const onOpenChange = useCallback(
      (open: boolean) => {
        if (!open) {
          onClose();
          setCurrentVersionId(null);
          editor?.commands.clearContent();
        }
      },
      [onClose, editor],
    );

    const handleRevert = useCallback(() => {
      const accepted = confirm(
        '버전을 되돌리시면 버전이 지정되지 않은 모든 변경 사항은 삭제됩니다.',
      );

      if (accepted) {
        if (currentVersionId && versionData) {
          onRevert(currentVersionId, versionData);
        }
        onClose();
      }
    }, [onRevert, currentVersionId, onClose]);

    return (
      <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed left-0 top-0 z-10 h-full w-full bg-black opacity-30' />
          <Dialog.Content className='fixed left-1/2 top-1/2 z-20 h-2/3 w-3/5 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded bg-white'>
            <div className='flex h-full w-full overflow-hidden'>
              <div className='h-full w-3/5 overflow-auto'>
                <div className='flex h-full flex-col p-8'>
                  <EditorContent editor={editor} />
                </div>
              </div>
              <div className='h-full w-2/5 p-8'>
                <div className='flex h-full flex-col gap-1'>
                  <div className='h-3/4 overflow-auto'>
                    {reversedVersions.map((v) => (
                      <VersionItem
                        date={new Date(v.date)}
                        title={getVersionName(v)}
                        onClick={() => handleVersionChange(v.version)}
                        isActive={currentVersionId === v.version}
                        key={`version_item_${v.version}`}
                      />
                    ))}
                  </div>
                  <hr />
                  <div className='mt-4 flex h-1/4 flex-col gap-3'>
                    <button
                      className={`bg-pubble py-2 disabled:bg-plblue ${versionData && !isCurrentVersion ? 'hover:bg-dpubble' : ''} rounded text-white`}
                      type='button'
                      disabled={!versionData || isCurrentVersion}
                      onClick={handleRevert}>
                      버전 되돌리기
                    </button>
                    <button
                      className='rounded bg-gray-200 py-2 text-black hover:bg-gray-800 hover:text-white'
                      type='button'
                      onClick={onClose}>
                      버전 히스토리 닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);

VersioningModal.displayName = 'VersioningModal';

export default VersioningModal;
