// 1. react 관련
import {
  memo, useCallback, useEffect, useMemo, useState,
} from 'react'
// 2. library
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { watchPreviewContent, CollabHistoryVersion } from '@tiptap-pro/extension-collaboration-history'
import { TiptapCollabProvider } from '@hocuspocus/provider';

import * as Dialog from '@radix-ui/react-dialog'
// 3. api
// 4. store
// 5. component
import VersionItem from '@/components/rich/VersionItem.tsx'
// 6. image 등 assets

const getVersionName = (version: CollabHistoryVersion) => {
  if (version.name) {
    return version.name
  }

  if (version.version === 0) {
    return 'Initial version'
  }

  return `Version ${version.version}`
}

interface VersioningModalProps {
  versions: CollabHistoryVersion[];
  isOpen: boolean;
  onClose: () => void;
  onRevert: (version: number, versionData: CollabHistoryVersion | undefined) => void;
  currentVersion: number;
  latestVersion: number;
  provider: TiptapCollabProvider;
}

const VersioningModal = memo(
  ({ versions, isOpen, onClose, onRevert, provider }: VersioningModalProps) => {
    const [currentVersionId, setCurrentVersionId] = useState<number | null>(null)
    const isCurrentVersion = versions && versions.length > 0 ? currentVersionId === versions[versions.length - 1].version : false

    const editor = useEditor({
      editable: false,
      content: '',
      extensions: [StarterKit],
    })

    const reversedVersions = useMemo(() => versions.slice().reverse(), [versions])

    const handleVersionChange = useCallback((newVersion: number) => {
      setCurrentVersionId(newVersion)

      provider.sendStateless(JSON.stringify({
        action: 'version.preview',
        version: newVersion,
      }))
    }, [provider])

    const versionData = useMemo(() => {
      if (!versions.length) {
        return null
      }

      return versions.find(v => v.version === currentVersionId)
    }, [currentVersionId, editor, provider])

    useEffect(() => {
      if (isOpen && currentVersionId === null && versions.length > 0) {
        const initialVersion = versions[versions.length - 1].version

        setCurrentVersionId(initialVersion)

        provider.sendStateless(JSON.stringify({
          action: 'version.preview',
          version: initialVersion,
        }))
      }
    }, [currentVersionId, versions, isOpen])

    useEffect(() => {
      if (isOpen) {
        const unbindContentWatcher = watchPreviewContent(provider, content => {
          if (editor) {
            editor.commands.setContent(content)
          }
        })

        return () => {
          unbindContentWatcher()
        }
      }
    }, [isOpen, provider, editor])

    const onOpenChange = useCallback(
      (open: boolean) => {
        if (!open) {
          onClose()
          setCurrentVersionId(null)
          editor?.commands.clearContent()
        }
      },
      [onClose, editor],
    )

    const handleRevert = useCallback(() => {
      const accepted = confirm('버전을 되돌리시면 버전이 지정되지 않은 모든 변경 사항은 삭제됩니다.')

      if (accepted) {
        if (currentVersionId && versionData) {
          onRevert(currentVersionId, versionData)
        }
        onClose()
      }
    }, [onRevert, currentVersionId, onClose])

    return (
      <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed top-0 left-0 w-full h-full z-10 opacity-30 bg-black" />
          <Dialog.Content className="bg-white fixed -translate-y-1/2 -translate-x-1/2 overflow-hidden z-20 top-1/2 w-3/5 left-1/2 rounded transform h-2/3">
            <div className="flex overflow-hidden w-full h-full">
              <div className="overflow-auto w-3/5 h-full">
                <div className="flex flex-col h-full">
                  <EditorContent editor={editor} />
                </div>
              </div>
              <div className="w-2/5 p-8 h-full">
                <div className="flex flex-col h-full gap-1">
                  <div className="h-3/4 overflow-auto">
                    {reversedVersions.map(v => (
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
                  <div className="h-1/4 flex flex-col gap-3 mt-4">
                    <button className={`py-2 bg-pubble ${(versionData && !isCurrentVersion) ? 'hover:bg-dpubble' : ''} text-white rounded`} type="button" disabled={!versionData || isCurrentVersion} onClick={handleRevert}>
                      버전 되돌리기
                    </button>
                    <button className="py-2 bg-gray-200 text-black hover:bg-gray-800 rounded hover:text-white" type="button" onClick={onClose}>
                      버전 히스토리 닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  },
)

VersioningModal.displayName = 'VersioningModal'

export default VersioningModal