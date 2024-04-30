import React, { useRef } from 'react';

// Props 타입 정의
interface AlertModalProps {
  children?: React.ReactNode;
  show: boolean;
  onClose: () => void;
}

const AlertModal = ({ children, onClose, show }: AlertModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    if (show) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [show]);

  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <h1>{children}</h1>
      <button onClick={onClose}>확인</button>
    </dialog>
  );
};

export default AlertModal;
