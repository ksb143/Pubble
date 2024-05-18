// 1. react
// 2. library
import Lottie from 'react-lottie';
// 3. api
// 4. store
// 5. component
// 6. asset
import Success from '@/assets/lotties/success.json';

const AlertModal = () => {
  // 로티 기본 옵션
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: Success,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
      <div className='fixed inset-0 z-[70] flex w-full items-center justify-center border-4 border-blue-500 bg-gray-900/30 backdrop-blur-none transition duration-700'>
        <div className='grid h-1/6 w-1/4 -translate-y-full grid-flow-row grid-rows-3 rounded-lg bg-white p-4'>
          <div className='row-span-1'>
            <Lottie options={defaultOptions} height={50} width={50} />
          </div>
          <div className='row-span-2 flex justify-center'>
            <p className='mt-4 text-lg font-normal'>쪽지 전송 성공했습니다!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertModal;
