// 1. react
// 2. library
// 3. api
// 4. store
// 5. component
import Profile from '@/components/layout/Profile';
// 6. assets

interface NotificationListProps {
  data: NotificationInfo[];
}

const NotificationList: React.FC<NotificationListProps> = ({ data }) => {
  return (
    <>
      {data.map((notification) => (
        <li
          key={notification.messageId}
          className='flex items-center justify-between border-b px-2 py-6 last-of-type:border-none'>
          <div className='flex flex-grow items-center'>
            <Profile
              width='3rem'
              height='3rem'
              name={notification.name}
              profileColor={notification.profileColor}
            />
            <p className='flex-grow px-2'>{notification.text}</p>
          </div>
          <div className='flex flex-col items-end'>
            <p>2024-05-04</p>
            <p>15:04</p>
          </div>
        </li>
      ))}
    </>
  );
};

export default NotificationList;
