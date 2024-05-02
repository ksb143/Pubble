import Xmark from '@/assets/icons/x-mark.svg?react';
import Bell from '@/assets/icons/bell.svg?react';

interface NotificationProps {
  closeNotification: () => void; // closeNotification 함수 타입 선언
}

const Notification: React.FC<NotificationProps> = ({ closeNotification }) => {
  return (
    <div className='fixed right-0 top-16 z-10 h-full w-1/3 border-2 border-red-600 bg-white p-2'>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <Bell className='h-8 w-8 stroke-gray-900 stroke-2' />
          <div className='text-2xl font-normal'>알림</div>
        </div>
        <Xmark
          className='h-8 w-8 stroke-gray-900'
          onClick={closeNotification}
        />
      </div>
    </div>
  );
};

export default Notification;
