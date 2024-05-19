// 1. react
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import { updateNotificationStatus } from '@/apis/notification';
import { NotificationInfo } from '@/types/notificationTypes';
import { extractDate, extractTime } from '@/utils/datetime';
// 4. store
import useNotificationStore from '@/stores/notificationStore';
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component
import Profile from '@/components/layout/Profile';
import Badge from '@/components/navbar/Badge';
// 6. asset
import ArrowRight from '@/assets/icons/arrow-right-circle.svg?react';

// api로 받아온 알림 리스트 타입 설정
interface NotificationListProps {
  data: NotificationInfo[];
  closeMenu: () => void;
  setActiveMenu: React.Dispatch<
    React.SetStateAction<null | 'message' | 'notification' | 'profile'>
  >;
}

const NotificationList = ({
  data,
  closeMenu,
  setActiveMenu,
}: NotificationListProps) => {
  const navigate = useNavigate();
  const { isNotificationChecked, setIsNotificationChecked } =
    useNotificationStore();
  const { setPageType } = usePageInfoStore();

  // 알림 읽었을 때 상태를 변경하는 함수
  const handleReadNotification = async (notification: NotificationInfo) => {
    if (!notification.isChecked) {
      try {
        await updateNotificationStatus(notification.notificationId);
        setIsNotificationChecked(!isNotificationChecked);
      } catch (error) {
        console.log('알림 상태 업데이트 실패 :', error);
      }
    }
  };

  // 알림 타입에 따라 화면에 출력되는 텍스트를 반환하는 함수
  const getNotificationMessage = (notification: NotificationInfo) => {
    const messages: { [key: string]: JSX.Element } = {
      MESSAGE: (
        <div>
          <p>
            <span className='font-normal'>{notification.senderInfo.name}</span>
            님이 <span className='mr-1 font-normal'>{notification.title}</span>
            쪽지를 보냈습니다.
          </p>
        </div>
      ),
      PROJECT: (
        <div>
          <p>
            <span className='font-normal'>{notification.senderInfo.name}</span>
            님이 <span className='mr-1 font-normal'>{notification.title}</span>
            프로젝트에 나를 배정했습니다.
          </p>
        </div>
      ),
      NEW_REQUIREMENT: (
        <div>
          <p>
            <span className='font-normal'>{notification.senderInfo.name}</span>
            님이 <span className='font-normal'>{notification.title}</span>에
            요구사항을 생성했습니다.
          </p>
        </div>
      ),
      MENTION: (
        <div>
          <p>{notification.senderInfo.name}님이 나를 멘션했습니다.</p>
        </div>
      ),
    };

    return messages[notification.type] || <p>알림이 있습니다.</p>;
  };

  // 알림을 클릭했을 때 해당 페이지로 이동하는 함수
  const handleArrowClick = (notification: NotificationInfo) => {
    let path: string | null = null;

    switch (notification.type) {
      case 'MESSAGE':
        setActiveMenu('message');
        break;
      case 'PROJECT':
        path = '/main';
        closeMenu();
        break;
      case 'NEW_REQUIREMENT':
        path = `/project/${notification.typeData.projectCode}`;
        setPageType('project', { projectId: notification.typeData.projectId });
        closeMenu();
        break;
      case 'MENTION':
        path = `/project/${notification.typeData.projectCode}/requirement/${notification.typeData.requirementCode}`;
        setPageType('project', { projectId: notification.typeData.projectId });
        setPageType('requirement', {
          requirementId: notification.typeData.requirementId,
        });
        closeMenu();
        break;
      default:
        alert('이동할 수 없는 페이지입니다.');
        break;
    }

    if (path) {
      navigate(path);
    }
  };

  return (
    <>
      {data.map((notification) => (
        <li
          key={notification.notificationId}
          className='relative flex items-center justify-between border-b px-2 py-6 last-of-type:border-none'>
          <div
            className='flex flex-1 items-center'
            onClick={() => handleReadNotification(notification)}>
            <Profile
              width='3rem'
              height='3rem'
              name={notification.senderInfo.name}
              profileColor={notification.senderInfo.profileColor}
            />
            <div className='flex w-0 flex-1 flex-col px-4'>
              <div>{getNotificationMessage(notification)}</div>
            </div>
          </div>
          <div className='flex shrink-0 flex-col items-end text-sm'>
            <p>{extractDate(notification.createdAt)}</p>
            <p>{extractTime(notification.createdAt)}</p>
          </div>
          <ArrowRight
            className={`ml-5 h-6 w-6 cursor-pointer stroke-gray-500 transition duration-300 hover:scale-110 hover:stroke-pubble`}
            onClick={() => {
              handleArrowClick(notification);
            }}
          />
          {!notification.isChecked && <Badge size='sm' position='left' />}
        </li>
      ))}
    </>
  );
};

export default NotificationList;
