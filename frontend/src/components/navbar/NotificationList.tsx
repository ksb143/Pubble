// 1. react
// 2. library
// 3. api
import { updateNotificationStatus } from '@/apis/notification';
import { NotificationInfo } from '@/types/notificationTypes';
import { extractDate, extractTime } from '@/utils/datetime';
// 4. store
import useNotificationStore from '@/stores/notificationStore';
// 5. component
import Profile from '@/components/layout/Profile';
import Badge from '@/components/navbar/Badge';
// 6. asset
import ArrowRight from '@/assets/icons/arrow-right-circle.svg?react';

// api로 받아온 알림 리스트 타입 설정
interface NotificationListProps {
  data: NotificationInfo[];
}

const NotificationList: React.FC<NotificationListProps> = ({ data }) => {
  const { isNotificationChecked, setIsNotificationChecked } =
    useNotificationStore();

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

  // 알림 타입에 따라 화면에 출력되는 텍스트
  const notificationMessages: { [key: string]: JSX.Element } = {
    message: (
      <div>
        <p>새 쪽지가 있습니다.</p>
        <p>쪽지함을 확인해 주세요.</p>
      </div>
    ),
    project: (
      <div>
        <p>새 프로젝트 알림이 있습니다.</p>
        <p>프로젝트 페이지를 확인해 주세요.</p>
      </div>
    ),
    new_requirement: (
      <div>
        <p>새 요구사항이 있습니다.</p>
        <p>요구사항 페이지를 확인해 주세요.</p>
      </div>
    ),
    mention: (
      <div>
        <p>멘션이 있습니다.</p>
        <p>멘션 알림을 확인해 주세요.</p>
      </div>
    ),
  };

  return (
    <>
      {data.map((notification) => (
        <li
          key={notification.notificationId}
          className='relative flex items-center justify-between border-b px-2 py-6 last-of-type:border-none'>
          <div
            className='flex flex-grow items-center'
            onClick={() => handleReadNotification(notification)}>
            {/* 이미지 부분 */}
            <Profile
              width='3rem'
              height='3rem'
              name={notification.senderInfo.name}
              profileColor={notification.senderInfo.profileColor}
            />
            {/* 내용 부분 */}
            <p>{notification.content}</p>
            <div className='flex-grow px-2'>
              {notificationMessages[notification.type]}
            </div>
          </div>
          <div className='flex shrink-0 flex-col items-end'>
            <p>{extractDate(notification.createdAt)}</p>
            <p>{extractTime(notification.createdAt)}</p>
          </div>
          <ArrowRight
            className={`ml-3 mt-3 h-4 w-4 cursor-pointer stroke-gray-400 transition duration-300`}
          />
          {!notification.isChecked && <Badge size='sm' position='left' />}
        </li>
      ))}
    </>
  );
};

export default NotificationList;
