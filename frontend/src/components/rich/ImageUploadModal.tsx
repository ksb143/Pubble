// 1. react 관련
import { useState, useRef, useEffect, DragEvent } from 'react';
// 2. library
// 3. api
import { getImageUrl } from '@/apis/rich.ts';
// 4. store
// 5. component
// 6. image 등 assets

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (image: string) => void;
  requirementId: number;
}

const ImageUploadModal = ({
  isOpen,
  onClose,
  onInsert,
  requirementId,
}: ImageUploadModalProps) => {
  const [tab, setTab] = useState('link');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialClick = useRef(true);

  // 이미지 링크 혹은 파일 삽입하는 함수
  const handleInsert = async () => {
    if (tab === 'link') {
      onInsert(url);
    } else if (tab === 'upload' && file) {
      try {
        const imageUrl = await getImageUrl(file, requirementId);
        onInsert(imageUrl);
      } catch (error) {
        console.error('Failed to upload image: ', error);
      }
    }
    setUrl('');
    setFile(null);
    onClose();
  };

  // 드래그 앤 드랍으로 이미지 삽입하는 함수
  const handleImageDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    setFile(file);
    setTab('upload');
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
    <div
      ref={modalRef}
      onDrop={handleImageDrop}
      onDragOver={(event) => event.preventDefault()}
      className='w-1/3 rounded bg-white p-6 shadow-custom'>
      <div className='mb-3 flex justify-around'>
        <button
          className={`px-4 py-2 ${tab === 'link' ? 'border-b-4 border-pubble' : ''}`}
          onClick={() => setTab('link')}>
          링크
        </button>
        <button
          className={`px-4 py-2 ${tab === 'upload' ? 'border-b-4 border-pubble' : ''}`}
          onClick={() => setTab('upload')}>
          업로드
        </button>
      </div>
      {tab === 'link' && (
        <input
          type='text'
          className='mb-3 w-full rounded border border-gray-200 p-2 py-3'
          placeholder='이미지 주소를 입력하세요'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      )}
      {tab === 'upload' && (
        <input
          type='file'
          name='upload'
          className='mb-3 w-full rounded border border-gray-200 p-2 py-3'
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      )}
      <div>
        <button
          onClick={handleInsert}
          className='font- w-full rounded bg-pubble py-1 text-2xl font-normal text-white hover:bg-blue-800 hover:shadow-custom'>
          삽입
        </button>
      </div>
    </div>
  );
};

export default ImageUploadModal;
