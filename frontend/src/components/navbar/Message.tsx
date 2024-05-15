/** @jsxImportSource @emotion/react */
// 1. react
import { useState, useEffect } from 'react';
// 2. library
import { css } from '@emotion/react';
import Lottie from 'react-lottie';
// 3. api
import { getMessageList } from '@/apis/message';
import { MessageInfo } from '@/types/messageTypes';
// 4. store
// 5. component
import MessageSendModal from '@/components/navbar/MessageSendModal';
import MessageList from '@/components/navbar/MessageList';
// 6. assets
import Xmark from '@/assets/icons/x-mark.svg?react';
import Envelope from '@/assets/icons/envelope.svg?react';
import MailPlus from '@/assets/icons/mail-plus.svg?react';
import Right from '@/assets/icons/chevron-right.svg?react';
import Left from '@/assets/icons/chevron-left.svg?react';
import NoData from '@/assets/lotties/no-data.json';

// 쪽지 모달 상태 타입 정의
interface MessageProps {
  isOpen: boolean;
  closeMenu: () => void;
}

// 상단바 높이를 제외한 화면 높이
const dialogStyle = css`
  height: calc(100vh - 64px);
`;

const Message: React.FC<MessageProps> = ({ isOpen, closeMenu }) => {
  const [isMessageSendModalOpen, setIsMessageSendModalOpen] = useState(false); // 쪽지 쓰기 모달 상태
  const itemsPerPage = 10; // 한 페이지에 보여줄 쪽지 수
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPage, setTotalPage] = useState(0); // 전체 페이지 수
  const [messageList, setMessageList] = useState<MessageInfo[]>([]); // 쪽지 리스트

  // 현재 페이지의 쪽지 리스트 조회
  useEffect(() => {
    (async () => {
      try {
        const response = await getMessageList(currentPage, itemsPerPage);
        setMessageList(response.data.content);
        setTotalPage(response.data.totalPages);
      } catch (error) {
        console.log('쪽지 조회 실패 : ', error);
      }
    })();
  }, [currentPage, messageList]);

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
      {/* 쪽지 쓰기 모달 */}
      <MessageSendModal
        isOpen={isMessageSendModalOpen}
        closeModal={() => {
          setIsMessageSendModalOpen(false);
        }}
      />
      {/* 쪽지 조회 모달 전체 */}
      <div
        className={`fixed bottom-0 right-0 top-16 z-20 w-1/3 overflow-y-auto rounded-l bg-white p-6 shadow-lg transition duration-1000 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        css={dialogStyle}>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <Envelope className='mr-2 h-6 w-6 stroke-gray-900 stroke-1' />
            <p className='text-2xl font-normal'>쪽지</p>
          </div>
          <div className='flex items-center'>
            <div className='mx-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded hover:bg-gray-900/10'>
              <MailPlus
                className='h-6 w-6 stroke-gray-900'
                onClick={() => {
                  setIsMessageSendModalOpen(true);
                }}
              />
            </div>
            <Xmark
              className='h-8 w-8 cursor-pointer stroke-gray-900 stroke-1'
              onClick={closeMenu}
            />
          </div>
        </div>
        {/* 쪽지 리스트 */}
        <ul className='flex flex-col'>
          {totalPage === 0 && (
            <>
              <Lottie options={defaultOptions} height={200} width={200} />
              <p className='flex justify-center'>받은 쪽지가 없습니다</p>
            </>
          )}
          {totalPage > 0 && (
            <>
              <MessageList data={messageList} />
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
            className={`flex h-8 w-8 items-center justify-center rounded ${currentPage === totalPage - 1 ? '' : 'cursor-pointer hover:bg-gray-500/10'}`}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage === totalPage - 1}>
            <Right
              className={`h-6 w-6 ${currentPage === totalPage - 1 ? 'stroke-gray-900/30' : 'stroke-gray-900/70'}`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Message;
