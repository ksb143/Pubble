// 1. react
// 2. library
// 3. api
import { updateNotificationStatus } from '@/apis/notification';
import { NotificationInfo } from '@/types/notificationTypes';
import { extractDate, extractTime } from '@/utils/datetime';
// 4. store
// 5. component
import Profile from '@/components/layout/Profile';
import Badge from '@/components/navbar/Badge';
// 6. assets

// api로 받아온 알림 리스트 타입 설정
interface NotificationListProps {
  data: NotificationInfo[];
}

const NotificationList: React.FC<NotificationListProps> = ({ data }) => {
  // 알림 읽었을 때 상태를 변경하는 함수
  const handleReadNotification = async (notification: NotificationInfo) => {
    if (!notification.isChecked) {
      try {
        await updateNotificationStatus(notification.notificationId);
      } catch (error) {
        console.log('알림 상태 업데이트 실패 :', error);
      }
    }
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
            {notification.senderInfo.name && (
              <Profile
                width='3rem'
                height='3rem'
                name={notification.senderInfo.name}
                profileColor={notification.senderInfo.profileColor}
              />
            )}
            {/* 내용 부분 */}
            <p className='flex-grow px-2'>{notification.content}</p>
          </div>
          <div className='flex shrink-0 flex-col items-end'>
            <p>{extractDate(notification.createdAt)}</p>
            <p>{extractTime(notification.createdAt)}</p>
          </div>
          {!notification.isChecked && <Badge size='sm' position='left' />}
        </li>
      ))}
    </>
  );
};

export default NotificationList;
