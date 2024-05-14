/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Xmark from '@/assets/icons/x-mark.svg?react';
import Bell from '@/assets/icons/bell.svg?react';
import Profile from '@/components/layout/Profile';

interface NotificationProps {
  isOpen: boolean;
  closeMenu: () => void;
}

interface ListItemProps {
  text: string;
}

const dialogStyle = css`
  height: calc(100vh - 64px);
`;

// ToDo: 로직 연결하면서 컴포넌트로 분리하기
const ListItem = ({ text }: ListItemProps) => (
  <li className='flex items-center justify-between border-b px-2 py-6 last-of-type:border-none'>
    <div className='flex flex-grow items-center'>
      <Profile width='3rem' height='3rem' />
      <p className='flex-grow px-2'>{text}</p>
    </div>
    <div className='flex flex-col items-end'>
      <p>2024-05-04</p>
      <p>15:04</p>
    </div>
  </li>
);

const items = Array.from({ length: 10 }, (_, index) => `Test${index + 1}`);

// ToDo : 불러온 데이터가 있는지 여부 => 삼항연산자 or 조건부 렌더링
const Notification: React.FC<NotificationProps> = ({ isOpen, closeMenu }) => {
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
          {items.map((item) => (
            <ListItem key={item} text={item} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Notification;
