// 1. react
import { useState, useEffect } from 'react';
// 2. library
// 3. api
import { sendMessage } from '@/apis/message';
import { getUser } from '@/apis/user';
import { autocompleteUser } from '@/utils/search';
// 4. store
// 5. component
// 6. assets
import Xmark from '@/assets/icons/x-mark.svg?react';
import Envelope from '@/assets/icons/envelope.svg?react';

// 쪽지 보내기 모달 상태 타입 정의
interface MessageSendModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

// 받는 사람 타입 정의
interface UserInfo {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  role: string;
  isApprovable: 'y' | 'n';
  profileColor: string;
}

const MessageSendModal: React.FC<MessageSendModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const [employeeName, setEmployeeName] = useState(''); // 받는 사람 이름
  const [employeeId, setEmployeeId] = useState(''); // 받는 사람 사번
  const [title, setTitle] = useState(''); // 쪽지 제목
  const [content, setContent] = useState(''); // 쪽지 내용
  const [users, setUsers] = useState<UserInfo[]>([]); // 전체 유저 리스트
  const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([]); // 자동완성 결과
  const [showDropdown, setShowDropdown] = useState(false); // 자동완성 드롭다운 표시 여부
  const [inputFocused, setInputFocused] = useState(false); // 입력 필드의 포커스 상태

  // API로 사용자 목록을 불러오는 함수
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUser();
        setUsers(response.data);
      } catch (error) {
        console.error('유저 정보 조회 실패 :', error);
      }
    };

    fetchUsers();
  }, []);

  // 사용자 검색어에 따라 자동완성 드롭다운 표시
  useEffect(() => {
    if (employeeName && inputFocused) {
      const filteredData = autocompleteUser(users, employeeName);
      setFilteredUsers(filteredData);
      setShowDropdown(true);
    } else if (inputFocused) {
      setFilteredUsers(users);
      setShowDropdown(true);
    }
  }, [employeeName, users, inputFocused]);

  // 사용자 선택 시 드롭다운 닫기
  const handleSelectUser = (user: UserInfo) => {
    setEmployeeName(user.name);
    setEmployeeId(user.employeeId);
    setShowDropdown(false);
  };

  // 쪽지 서버로 전송하는 함수
  const handleSendMessage = async () => {
    if (!title || !content || !employeeName) {
      alert('모든 항목을 입력해주세요!');
      return;
    }

    if (title.length > 15) {
      alert('제목은 15자 이내로 입력해주세요!');
      return;
    }

    try {
      await sendMessage(employeeId, title, content);
      setTitle('');
      setContent('');
      setEmployeeName('');
      setEmployeeId('');
      closeModal();
      alert('쪽지를 전송했습니다!');
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
          <div className='relative mb-5'>
            <p>받는 사람</p>
            <input
              type='text'
              placeholder='이름을 입력해주세요'
              className='h-12 w-full rounded border-2 border-gray-200 p-2 focus:outline-pubble'
              value={employeeName}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            {showDropdown && (
              <div className='absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-lg'>
                {filteredUsers.map((user) => (
                  <div
                    key={user.employeeId}
                    onClick={() => handleSelectUser(user)}
                    className='m-2 flex cursor-pointer items-center'>
                    <p className='w-full rounded px-3 py-2 hover:bg-gray-500/10'>
                      {user.name} ({user.department} {user.position})
                    </p>
                  </div>
                ))}
              </div>
            )}
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
              placeholder='내용을 입력해주세요'
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
