/** @jsxImportSource @emotion/react */
// 1. react
import { useState, useEffect } from 'react';
// 2. library
import { css } from '@emotion/react';
import Lottie from 'react-lottie';
// 3. api
import { getNotificationList } from '@/apis/notification';
import { NotificationInfo } from '@/types/notificationTypes';
// 4. store
import useNotificationStore from '@/stores/notificationStore';
import useUserStore from '@/stores/userStore';
// 5. component
import NotificationList from '@/components/navbar/NotificationList';
// 6. assets
import Xmark from '@/assets/icons/x-mark.svg?react';
import Bell from '@/assets/icons/bell.svg?react';
import Right from '@/assets/icons/chevron-right.svg?react';
import Left from '@/assets/icons/chevron-left.svg?react';
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
  const { hasNewMessage, hasNewNotification, isNotificationChecked } =
    useNotificationStore();
  const { userId } = useUserStore();
  const itemsPerPage = 10; // 한 페이지에 보여줄 알림 수
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPage, setTotalPage] = useState(0); // 전체 페이지 수
  const [notificationList, setNotificationList] = useState<NotificationInfo[]>(
    [],
  ); // 알림 리스트

  // 현재 페이지의 알림 리스트 조회
  useEffect(() => {
    (async () => {
      try {
        const response = await getNotificationList(
          currentPage,
          itemsPerPage,
          userId,
        );
        setNotificationList(response.content);
        setTotalPage(response.totalPages);
        console.log('알림 조회 성공 : ', response);
      } catch (error) {
        console.log('알림 조회 실패 : ', error);
      }
    })();
  }, [
    currentPage,
    hasNewNotification,
    hasNewMessage,
    isNotificationChecked,
    userId,
  ]);

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
      {/* 알림 조회 모달 전체 */}
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
        {/* 알림 리스트 */}
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
        {/* 페이지네이션 */}
        <div className='mt-4 flex items-center justify-center'>
          <button
            className={`flex h-8 w-8 items-center justify-center rounded ${currentPage === 0 ? '' : 'cursor-pointer hover:bg-gray-500/10'}`}
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
            disabled={currentPage === 0}>
            <Left
              className={`h-6 w-6 ${currentPage === 0 ? 'stroke-gray-900/30' : 'stroke-gray-900/70'}`}
            />
          </button>
          <span className='mx-4 text-center text-lg'>{currentPage + 1}</span>
          <button
            className={`flex h-8 w-8 items-center justify-center rounded ${currentPage === totalPage - 1 || totalPage === 0 ? '' : 'cursor-pointer hover:bg-gray-500/10'}`}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage === totalPage - 1 || totalPage === 0}>
            <Right
              className={`h-6 w-6 ${currentPage === totalPage - 1 || totalPage === 0 ? 'stroke-gray-900/30' : 'stroke-gray-900/70'}`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Notification;
