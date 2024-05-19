// 1. react
import { useEffect } from 'react';
// 2. library
import Lottie from 'react-lottie';
// 3. api
// 4. store
// 5. component
// 6. asset
import Success from '@/assets/lotties/success.json';
import Warning from '@/assets/lotties/warning-big.json';

interface AlertModalProps {
  text: string;
  buttonsType: 'autoclose' | 'confirm' | 'yesno'; // 버튼 타입: 자동꺼짐, 확인, 네/아니오
  closeModal: () => void;
  onConfirm?: () => void; // '네' 버튼 클릭 시 실행할 로직
}

const AlertModal = ({
  text,
  buttonsType = 'confirm',
  closeModal,
  onConfirm,
}: AlertModalProps) => {
  // 하나의 string을 '.'을 기준으로 나누고 filter(Boolean)를 사용하여 빈 문자열 제거
  const sentences = text.split('.').filter(Boolean);

  // 성공 로티 옵션
  const successOptions = {
    loop: false,
    autoplay: true,
    animationData: Success,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // 경고 로티 옵션
  const warningOptions = {
    loop: false,
    autoplay: true,
    animationData: Warning,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // autoClose가 true일 때 5초 후 모달 닫기
  useEffect(() => {
    if (buttonsType === 'autoclose') {
      const timer = setTimeout(() => {
        closeModal();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [buttonsType, closeModal]);

  return (
    <div className='fixed inset-0 z-[70] flex w-full items-center justify-center bg-transparent backdrop-blur-none transition duration-700'>
      <div className='grid h-1/5 w-1/4 -translate-y-1/2 grid-flow-row grid-rows-3 rounded-lg border bg-white p-4 shadow-lg'>
        <div className='row-span-1'>
          {buttonsType === 'autoclose' ? (
            <Lottie options={successOptions} height={45} width={45} />
          ) : (
            <Lottie options={warningOptions} height={45} width={45} />
          )}
        </div>
        <div className='row-span-1 flex flex-col items-center justify-center text-center'>
          {/* 각 문장을 p 태그로 래핑하여 렌더링 */}
          {sentences.map((sentence, index) => (
            <p key={index} className='text-lg font-normal'>
              {sentence.trim()}
              {index < sentences.length - 1 ? '.' : ''}
            </p>
          ))}
        </div>
        <div className='row-span-1 flex items-end justify-center'>
          {buttonsType === 'confirm' && (
            <button
              className='mb-1 rounded bg-pubble px-2 py-1 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
              onClick={closeModal}>
              확인
            </button>
          )}
          {buttonsType === 'yesno' && (
            <>
              <button
                className='mb-1 mr-3 w-1/5 rounded border border-pubble bg-pubble px-2 py-1 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
                onClick={() => {
                  onConfirm?.();
                  closeModal();
                }}>
                네
              </button>
              <button
                className='mb-1 w-1/5 rounded border border-pubble px-2 py-1 text-black hover:outline-double hover:outline-4 hover:outline-gray-200'
                onClick={closeModal}>
                아니오
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
