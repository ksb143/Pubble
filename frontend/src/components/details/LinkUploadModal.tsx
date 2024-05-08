import { useState } from 'react';

interface LinkUploadModalProps {
  tabType: string;
  isOpen: boolean;
  onClose: () => void;
  onInsert: (link: string, linkType: string) => void;
}

const LinkUploadModal = ({
  tabType,
  isOpen,
  onClose,
  onInsert,
}: LinkUploadModalProps) => {
  const [linkType, setLinkType] = useState(tabType);
  const [url, setUrl] = useState('');

  // 링크 삽입하는 함수
  const handleInsert = (linkType: string) => {
    onInsert(url, linkType);
    setUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='w-1/3 rounded bg-white p-6 shadow-custom'>
      <div className='mb-3 flex justify-around'>
        <button
          className={`px-4 py-2 ${linkType === 'link' ? 'border-b-4 border-pubble' : ''}`}
          onClick={() => setLinkType('link')}>
          링크
        </button>
        <button
          className={`px-4 py-2 ${linkType === 'webImage' ? 'border-b-4 border-pubble' : ''}`}
          onClick={() => setLinkType('webImage')}>
          웹이미지
        </button>
      </div>
      {linkType === 'link' && (
        <input
          type='text'
          className='mb-3 w-full rounded border border-gray-200 p-2 py-3'
          placeholder='삽입할 링크 주소를 입력하세요'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      )}
      {linkType === 'webImage' && (
        <input
          type='text'
          className='mb-3 w-full rounded border border-gray-200 p-2 py-3'
          placeholder='삽입할 웹이미지 주소를 입력하세요'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      )}
      <div>
        <button
          onClick={() => {
            handleInsert(linkType);
          }}
          className='font- w-full rounded bg-pubble py-1 text-2xl font-normal text-white hover:bg-blue-800 hover:shadow-custom'>
          삽입
        </button>
      </div>
    </div>
  );
};

export default LinkUploadModal;
