// 1. react 관련
import { useState, useCallback } from 'react';
// 2. library
import * as Dialog from '@radix-ui/react-dialog';
// 3. api
import { getFileUrl } from '@/apis/rich.ts';
// 4. store
// 5. component
// 6. image 등 assets

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (fileUrl: string, fileName: string) => void;
}

const FileUploadModal = ({
  isOpen,
  onClose,
  onInsert,
}: FileUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);

  // 오픈 변경 함수
  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose],
  );

  // 파일 삽입하는 함수
  const handleInsert = async () => {
    try {
      if (!file) {
        alert('파일을 선택해주세요.');
        return;
      }
      const fileUrl = await getFileUrl(file);
      onInsert(fileUrl, file.name);
      setFile(null);
      onClose();
    } catch (error) {
      console.error('file upload failed', error);
      alert('파일 업로드에 실패했습니다');
    }
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed left-0 top-0 z-10 h-full w-full bg-opacity-100'>
          <Dialog.Content className='fixed left-1/2 top-1/2 z-20 h-1/3 w-1/4 -translate-x-1/2 -translate-y-1/2 transform rounded bg-white p-6 shadow-custom'>
            <div className='mb-3 flex'>
              <span className='border-b-4 border-pubble px-4 py-2'>파일</span>
            </div>
            <input
              type='file'
              name='upload'
              className='mb-3 w-full rounded border border-gray-200 p-2 py-3'
              onChange={(event) => {
                const selectedFile = event.target.files
                  ? event.target.files[0]
                  : null;
                setFile(selectedFile);
              }}
            />
            <div>
              <button
                onClick={handleInsert}
                className='font- w-full rounded bg-pubble py-1 text-2xl font-normal text-white hover:bg-blue-800 hover:shadow-custom'>
                삽입
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FileUploadModal;
