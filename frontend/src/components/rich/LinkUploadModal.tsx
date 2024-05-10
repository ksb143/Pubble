import { useState, useRef, useEffect } from 'react';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const initialClick = useRef(true);

  // 링크 삽입하는 함수
  const handleInsert = (linkType: string) => {
    onInsert(url, linkType);
    setUrl('');
    onClose();
  };

  // tabType이 변경 감지 및 상태 업데이트
  useEffect(() => {
    setLinkType(tabType);
  }, [tabType]);

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
