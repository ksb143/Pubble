/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css } from '@emotion/react';
import Xmark from '@/assets/icons/x-mark.svg?react';
import Envelope from '@/assets/icons/envelope.svg?react';
import MailPlus from '@/assets/icons/mail-plus.svg?react';
import Down from '@/assets/icons/chevron-down.svg?react';
import Profile from '@/components/layouts/Profile';

interface MessageProps {
  isOpen: boolean;
  closeModal: () => void;
}

interface ListItemProps {
  title: string;
  content: string;
}

const dialogStyle = css`
  height: calc(100vh - 64px);
`;

// ToDo: 로직 연결하면서 컴포넌트로 분리하기
const ListItem = ({ title, content }: ListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className='flex items-center justify-between border-b py-6 pl-2 last-of-type:border-none'>
      <div className='flex flex-1 items-center'>
        <Profile />
        <div className='flex w-0 flex-1 flex-col px-2'>
          <div className={`font-normal ${isExpanded ? '' : 'truncate'}`}>
            {title}
          </div>
          <div className={`${isExpanded ? '' : 'truncate'}`}>{content}</div>
        </div>
      </div>
      <div className='flex flex-col items-end'>
        <div>2024-05-04</div>
        <div>15:04</div>
      </div>
      <Down
        className={`ml-3 h-4 w-4 cursor-pointer stroke-gray-400 ${isExpanded ? 'rotate-180' : ''}`}
        onClick={toggleExpansion}
      />
    </li>
  );
};

const items = Array.from(
  { length: 10 },
  (_, index) =>
    `길이테스트중입니다길이테스트중입니다길이테스트중입니다${index + 1}`,
);

const Message: React.FC<MessageProps> = ({ isOpen, closeModal }) => {
  return (
    <div
      className={`fixed bottom-0 right-0 top-16 z-20 w-1/3 overflow-y-auto rounded-l bg-white p-6 shadow-lg transition duration-1000 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      css={dialogStyle}>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center'>
          <Envelope className='mr-2 h-6 w-6 stroke-gray-900 stroke-1' />
          <div className='text-2xl font-normal'>쪽지</div>
        </div>
        <div className='flex items-center'>
          <MailPlus className='mx-6 h-6 w-6 cursor-pointer stroke-gray-900' />
          <Xmark
            className='h-8 w-8 cursor-pointer stroke-gray-900 stroke-1'
            onClick={closeModal}
          />
        </div>
      </div>
      <ul className='flex flex-col'>
        {items.map((item) => (
          <ListItem key={item} title={item} content={item} />
        ))}
      </ul>
    </div>
  );
};

export default Message;
