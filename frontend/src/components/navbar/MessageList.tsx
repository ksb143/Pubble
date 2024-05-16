// 1. react
import { useState } from 'react';
// 2. library
// 3. api
import { updateMessageStatus } from '@/apis/message';
import { MessageInfo } from '@/types/messageTypes';
import { extractDate, extractTime } from '@/utils/time-format';
// 4. store
// 5. component
// 6. assets
import Down from '@/assets/icons/chevron-down.svg?react';
import Profile from '@/components/layout/Profile';
import Badge from '@/components/navbar/Badge';

// api로 받아온 쪽지 리스트 타입 설정
interface MessageListProps {
  data: MessageInfo[];
}

const MessageList: React.FC<MessageListProps> = ({ data }) => {
  // 쪽지 읽었는지 여부 상태
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(
    null,
  );

  // 쪽지 내용 확장 토글 함수
  const handleToggleExpand = (messageId: number) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  // 쪽지 읽었을 때 상태를 변경하는 함수
  const handleReadMessage = async (message: MessageInfo) => {
    if (message.status !== 'r') {
      try {
        await updateMessageStatus(message.messageId, 'r');
      } catch (error) {
        console.log('쪽지 상태 업데이트 실패 :', error);
      }
    }
  };

  return (
    <>
      {data.map((message) => (
        <li
          key={message.messageId}
          className='relative flex justify-between border-b py-6 pl-2 last-of-type:border-none'>
          <div
            className='flex flex-1'
            onClick={() => handleReadMessage(message)}>
            <Profile
              width='3rem'
              height='3rem'
              name={message.senderInfo.name}
              profileColor={message.senderInfo.profileColor}
            />
            <div className='flex w-0 flex-1 flex-col px-2'>
              <p
                className={`font-normal ${expandedMessageId === message.messageId ? '' : 'truncate'}`}>
                {message.title}
              </p>
              <p
                className={`${expandedMessageId === message.messageId ? '' : 'truncate'}`}>
                {message.content}
              </p>
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <p>{extractDate(message.createdAt)}</p>
            <p>{extractTime(message.createdAt)}</p>
          </div>
          <Down
            className={`ml-3 mt-3 h-4 w-4 cursor-pointer stroke-gray-400 transition duration-300 ${expandedMessageId === message.messageId ? 'rotate-180' : ''}`}
            onClick={() => {
              handleToggleExpand(message.messageId);
            }}
          />
          {message.status !== 'r' && <Badge size='sm' />}
        </li>
      ))}
    </>
  );
};

export default MessageList;
