// 1. react 관련
import { useState, useCallback } from 'react';
// 2. library
import * as Dialog from '@radix-ui/react-dialog';
import { getImageUrl } from '@/apis/rich.ts';
// 3. api
// 4. store
// 5. component
// 6. image 등 assets
const { VITE_SCREENSHOT_API } = import.meta.env;

interface LinkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (link: string, linkType: string) => void;
  requirementId: number;
}

const LinkUploadModal = ({
  isOpen,
  onClose,
  onInsert,
  requirementId,
}: LinkUploadModalProps) => {
  const [linkType, setLinkType] = useState('link');
  const [url, setUrl] = useState('');

  // 오픈 변경 함수
  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose],
  );

  // url 스크린샷 집어넣는 함수
  const fetchScreenshotData = async (url: string) => {
    const response = await fetch(
      `https://api.screenshotone.com/animate?url=${encodeURIComponent(url)}&access_key=${VITE_SCREENSHOT_API}&format=gif`,
    );
    if (!response.ok) {
      console.error('Failed to fetch screenshot data: ', response);
      alert('링크 스크린샷을 가져오는데 실패했습니다');
    }
    try {
      const blob = await response.blob();
      const fileName = `screenshot-${new Date().getTime()}.gif`;
      const file = new File([blob], fileName, { type: blob.type });
      const imageUrl = await getImageUrl(file, requirementId);
      return imageUrl;
    } catch (error) {
      console.error('Failed to upload image: ', error);
      alert('이미지 업로드에 실패했습니다');
    }
  };

  // 링크 삽입하는 함수
  const handleInsert = () => {
    if (linkType === 'link') {
      onInsert(url, linkType);
    } else if (linkType === 'webImage') {
      fetchScreenshotData(url).then((imageUrl) => {
        onInsert(imageUrl, linkType);
      });
    }
    setUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Overlay className='fixed left-0 top-0 z-10 h-full w-full opacity-100'>
        <Dialog.Content className='fixed left-1/2 top-1/2 z-20 h-1/3 w-1/4 -translate-x-1/2 -translate-y-1/2 transform rounded bg-white p-6 shadow-custom'>
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
                handleInsert();
              }}
              className='font- w-full rounded bg-pubble py-1 text-2xl font-normal text-white hover:bg-blue-800 hover:shadow-custom'>
              삽입
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  );
};

export default LinkUploadModal;
