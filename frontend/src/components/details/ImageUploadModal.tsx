import { useState, DragEvent } from 'react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (image: string) => void;
}

const ImageUploadModal = ({
  isOpen,
  onClose,
  onInsert,
}: ImageUploadModalProps) => {
  const [tab, setTab] = useState('link');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // 이미지 링크 혹은 파일 삽입하는 함수
  const handleInsert = () => {
    if (tab === 'link') {
      onInsert(url);
    } else if (tab === 'upload' && file) {
      const imageUrl = URL.createObjectURL(file);
      onInsert(imageUrl);
    }
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

  if (!isOpen) return null;

  return (
    <div
      onDrop={handleImageDrop}
      onDragOver={(event) => event.preventDefault()}>
      <div className='flex justify-around'>
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
          className='w-full border border-gray-200 p-2'
          placeholder='이미지 주소를 입력하세요'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      )}
      {tab === 'upload' && (
        <input
          type='file'
          className='w-full border border-gray-200 p-2'
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      )}
      <div>
        <button
          onClick={handleInsert}
          className='font- bg-pubble text-2xl font-normal text-white hover:bg-blue-800 hover:shadow-custom'>
          삽입
        </button>
      </div>
    </div>
  );
};

export default ImageUploadModal;
