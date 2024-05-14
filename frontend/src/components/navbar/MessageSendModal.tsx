import { useState } from 'react';
import { sendMessage } from '@/apis/message.ts';
import Xmark from '@/assets/icons/x-mark.svg?react';
import Envelope from '@/assets/icons/envelope.svg?react';

interface MessageSendModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const MessageSendModal: React.FC<MessageSendModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSendMessage = async () => {
    if (!title || !content || !employeeId) {
      alert('모든 항목을 입력해주세요!');
      return;
    }
    console.log('보내기 함수', employeeId, title, content);
    try {
      const response = await sendMessage(employeeId, title, content);
      console.log('Message sent:', response);
      setTitle('');
      setContent('');
      setEmployeeId('');
      closeModal();
    } catch (error) {
      console.log('쪽지 보내기 실패 : ', error);
      alert('쪽지 전송에 실패했습니다.');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition duration-500 ${
        isOpen
          ? ' bg-gray-900/30 backdrop-blur-none'
          : 'pointer-events-none -z-10 opacity-0'
      }`}>
      <div className='h-fit w-1/3 rounded bg-white p-6 shadow-lg'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center'>
            <Envelope className='mr-3 h-6 w-6 stroke-gray-900 stroke-1' />
            <p className='text-2xl font-normal'>쪽지 쓰기</p>
          </div>
          <Xmark
            className='h-7 w-7 cursor-pointer stroke-gray-900 stroke-1'
            onClick={closeModal}
          />
        </div>
        <div>
          <div className='mb-5'>
            <p>받는 사람</p>
            <input
              type='text'
              className='h-12 w-full rounded border-2 border-gray-200 p-2 focus:outline-pubble'
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <div className='mb-5'>
            <p>제목</p>
            <input
              type='text'
              placeholder='제목을 15자 이내로 입력해주세요'
              className='h-12 w-full rounded border-2 border-gray-200 p-2 focus:outline-pubble'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='mb-5'>
            <p>내용</p>
            <textarea
              className='h-40 w-full resize-none rounded border-2 border-gray-200 p-2 focus:outline-pubble'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            className='w-1/4 rounded bg-pubble py-3 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
            onClick={handleSendMessage}>
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageSendModal;
