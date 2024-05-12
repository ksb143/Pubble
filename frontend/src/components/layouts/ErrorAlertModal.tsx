// 1. react
import { ReactNode, useRef, useEffect } from 'react';
// 2. library
import Lottie from 'react-lottie';
// 3. api
// 4. store
// 5. component
// 6. assets
import warningAnimation from '@/assets/lotties/warning.json';

// Props 타입 정의
interface AlertModalProps {
  children: ReactNode;
  isOpen: boolean;
  closeDialog: () => void;
}

const ErrorAlertModal = ({
  children,
  isOpen,
  closeDialog,
}: AlertModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [isOpen]);

  // 로티 기본 옵션
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: warningAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // 닫기 함수
  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    closeDialog();
  };

  return (
    <dialog ref={dialogRef} className='rounded text-center lg:w-4/12'>
      <div className='mb-8 flex items-center bg-red-600 py-1'>
        <div>
          <Lottie options={defaultOptions} height={50} width={50} />{' '}
        </div>
        <h1 className='text-lg font-normal text-white'>Error</h1>
      </div>
      <h2 className='mb-8 whitespace-pre-line'>{children}</h2>
      <button
        onClick={handleClose}
        className='mb-8 rounded bg-pubble px-10 py-2 text-white hover:shadow-lg hover:outline-double hover:outline-4 hover:outline-gray-200'>
        확인
      </button>
    </dialog>
  );
};

export default ErrorAlertModal;
