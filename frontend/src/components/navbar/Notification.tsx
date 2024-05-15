/** @jsxImportSource @emotion/react */
// 1. react
import { useState } from 'react';
// 2. library
import { css } from '@emotion/react';
import Lottie from 'react-lottie';
// 3. api
// 4. store
// 5. component
import NotificationList from '@/components/navbar/NotificationList';
// 6. assets
import Xmark from '@/assets/icons/x-mark.svg?react';
import Bell from '@/assets/icons/bell.svg?react';
import NoData from '@/assets/lotties/no-data.json';

// 알림 모달 상태 타입 정의
interface NotificationProps {
  isOpen: boolean;
  closeMenu: () => void;
}

// 상단바 높이를 제외한 화면 높이
const dialogStyle = css`
  height: calc(100vh - 64px);
`;

const Notification: React.FC<NotificationProps> = ({ isOpen, closeMenu }) => {
  const [notificationList, setNotificationList] = useState([]); // 알림 리스트

  // 로티 기본 옵션
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <>
      <div
        className={`fixed bottom-0 right-0 top-16 z-20 w-1/3 overflow-y-auto rounded-l bg-white p-6 shadow-lg transition duration-1000 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        css={dialogStyle}>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <Bell className='mr-2 h-6 w-6 fill-gray-900 stroke-gray-900 stroke-2' />
            <p className='text-2xl font-normal'>알림</p>
          </div>
          <Xmark
            className='h-8 w-8 cursor-pointer stroke-gray-900 stroke-1'
            onClick={closeMenu}
          />
        </div>
        <ul className='flex flex-col'>
          {notificationList.length === 0 && (
            <>
              <Lottie options={defaultOptions} height={200} width={200} />
              <p className='flex justify-center'>받은 알림이 없습니다</p>
            </>
          )}
          {notificationList.length > 0 && (
            <>
              <NotificationList data={notificationList} />
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Notification;
