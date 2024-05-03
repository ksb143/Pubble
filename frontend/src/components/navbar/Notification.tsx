/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Xmark from '@/assets/icons/x-mark.svg?react';
import Bell from '@/assets/icons/bell.svg?react';
import Profile from '@/components/layouts/Profile';

interface NotificationProps {
  show: boolean;
  closeNotification: () => void;
}

const dialogStyle = css`
  height: calc(100vh - 64px);
`;

const ListItem = ({ text }) => (
  <li className='flex items-center border-b px-2 py-6 last-of-type:border-none'>
    <Profile />
    <div className='px-2'>{text}</div>
  </li>
);

const items = Array.from({ length: 10 }, (_, index) => `Test${index + 1}`);

const Notification: React.FC<NotificationProps> = ({
  show,
  closeNotification,
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 transition duration-500 ${show ? 'z-10 bg-gray-900/30' : '-z-10 bg-transparent'}`}
        onClick={closeNotification}></div>

      <div
        className={`fixed bottom-0 right-0 top-16 z-20 w-[30%] overflow-y-auto rounded-l bg-white p-4 shadow-lg transition duration-1000 ${show ? 'translate-x-0' : 'translate-x-full'}`}
        css={dialogStyle}>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <Bell className='mr-2 h-6 w-6 fill-gray-900 stroke-gray-900 stroke-2' />
            <div className='text-2xl font-normal'>알림</div>
          </div>
          <Xmark
            className='h-8 w-8 stroke-gray-900 stroke-1'
            onClick={closeNotification}
          />
        </div>
        <ul className='flex flex-col p-2'>
          {items.map((item) => (
            <ListItem key={item} text={item} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Notification;
