// 1. react 관련
import { useState, useRef, useEffect } from 'react';
// 2. library
// 3. api
import { getFileUrl } from '@/apis/rich.ts';
// 4. store
// 5. component
// 6. image 등 assets

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (fileUrl: string, fileName: string) => void;
  requireUniqueId: number;
}

const FileUploadModal = ({
  isOpen,
  onClose,
  onInsert,
  requireUniqueId,
}: FileUploadModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const initialClick = useRef(true);
  const [file, setFile] = useState<File | null>(null);

  // 파일 삽입하는 함수
  const handleInsert = async () => {
    try {
      if (!file) {
        alert('파일을 선택해주세요.');
        return;
      }
      const fileUrl = await getFileUrl(file, requireUniqueId);
      onInsert(fileUrl, file.name);
      setFile(null);
      onClose();
    } catch (error) {
      console.error('file upload failed', error);
      alert('파일 업로드에 실패했습니다');
    }
    onClose();
  };

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !initialClick.current &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
      initialClick.current = false;
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className='w-1/3 rounded bg-white p-6 shadow-custom'>
      <div className='mb-3 flex justify-around'>
        <button className='border-b-4 border-pubble px-4 py-2'>파일</button>
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
          onClick={() => {
            handleInsert();
          }}
          className='font- w-full rounded bg-pubble py-1 text-2xl font-normal text-white hover:bg-blue-800 hover:shadow-custom'>
          삽입
        </button>
      </div>
    </div>
  );
};

export default FileUploadModal;
