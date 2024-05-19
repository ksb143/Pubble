// 1. react
import { useEffect } from 'react';
// 2. library
import Lottie from 'react-lottie';
// 3. api
// 4. store
// 5. component
// 6. asset
import Success from '@/assets/lotties/success.json';

interface AlertModalProps {
  text: string;
  autoClose?: boolean; // 자동으로 닫히는지 여부
  closeModal: () => void;
}

// text='쪽지 전송 성공했습니다!' autoClose={true} closeModal={() => setAlertOpen(false)}
const AlertModal: React.FC<AlertModalProps> = ({
  text,
  autoClose = false,
  closeModal,
}) => {
  // 로티 기본 옵션
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: Success,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // autoClose가 true일 때 5초 후 모달 닫기
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        closeModal();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, closeModal]);

  return (
    <>
      <div className='fixed inset-0 z-[70] flex w-full items-center justify-center bg-transparent backdrop-blur-none transition duration-700'>
        <div className='grid h-1/6 w-1/4 -translate-y-full grid-flow-row grid-rows-3 rounded-lg bg-white p-4'>
          <div className='row-span-1'>
            <Lottie options={defaultOptions} height={45} width={45} />
          </div>
          <div className='row-span-1 flex justify-center'>
            <p className='text-lg font-normal'>{text}</p>
          </div>
          <div className='row-span-1'>
            {!autoClose && (
              <button
                className='row-span-1 w-1/4 rounded bg-pubble p-2 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
                onClick={closeModal}>
                확인
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertModal;
