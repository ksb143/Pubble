/** @jsxImportSource @emotion/react */
// 1. react
import { useState, useEffect, useRef } from 'react';
// 2. library
import { css } from '@emotion/react';
// 3. api
import { getUserByProject } from '@/apis/user';
import { createComment, lockThread } from '@/apis/requirement';
import { ThreadInfo, ReceiverInfo } from '@/types/threadType';
import { autocompleteUser } from '@/utils/search';
import { UserInfo } from '@/types/userType';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
import useUserStore from '@/stores/userStore';
// 5. component
import Profile from '@/components/layout/Profile';
import AlertModal from '@/components/layout/AlertModal';
// 6. asset
import Locked from '@/assets/icons/lock-closed.svg?react';
import Unlocked from '@/assets/icons/lock-open.svg?react';
import Pencil from '@/assets/icons/pencil.svg?react';

// api로 받아온 스레드 타입 설정
interface ThreadProps {
  data: ThreadInfo[];
  selected: boolean;
  isActive: boolean;
  setActiveThreadId: (threadId: number | null) => void;
  updateCommentList: () => void;
  isRequirementLocked: boolean;
}

// 버튼 넓이를 제외한 드롭다운 넓이
const dropdownStyle = css`
  width: calc(100% - 44px);
`;

const Thread = ({
  data,
  selected,
  // isActive,
  setActiveThreadId,
  updateCommentList,
  isRequirementLocked,
}: ThreadProps) => {
  const { projectId, requirementId } = usePageInfoStore();
  const { employeeId } = useUserStore();
  const [commentInput, setCommentInput] = useState('');
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [mentionList, setMentionList] = useState<UserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<ReceiverInfo>({
    isMentioned: false,
    receiverId: '',
    receiverName: '',
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false); // 알림 모달 오픈 여부
  const [alertModalProps, setAlertModalProps] = useState({
    text: '',
    buttonsType: 'yesno' as 'autoclose' | 'confirm' | 'yesno',
    status: 'warning' as 'success' | 'warning',
    closeModal: () => setIsAlertOpen(false),
    onConfirm: undefined as (() => void) | undefined,
  }); // 알림 모달 props 정보
  const inputRef = useRef<HTMLDivElement>(null); // 입력창과 드롭다운 입력 필드 ref
  const scrollRef = useRef<HTMLUListElement>(null); // 스크롤 위치를 조정할 ref 생성
  const [hasNewComment, setHasNewComment] = useState(false); // 새로운 댓글이 있는지 여부

  // 댓글 목록이 업데이트 될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]); // data가 변경될 때마다 이 효과를 실행

  // 받는사람 입력 필드 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setMentionList([]); // 멘션 리스트 초기화
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setCommentInput(input);

    const parts = input.split('@');
    const searchTerm = parts.pop(); // 마지막 '@' 이후의 문자열을 검색어로 사용
    if (searchTerm && searchTerm.length > 0) {
      const filteredUsers = autocompleteUser(allUsers, searchTerm.trim());
      setMentionList(filteredUsers);
    } else {
      setMentionList([]); // 검색어가 없다면 리스트 초기화
    }
  };

  const handleUserSelect = (user: UserInfo) => {
    // 마지막 '@' 문자를 찾아서 그 뒤의 텍스트를 유저 이름으로 대체
    const lastIndex = commentInput.lastIndexOf('@');
    if (lastIndex !== -1) {
      const beforeAt = commentInput.substring(0, lastIndex); // '@' 이전의 텍스트
      const newInput = `${beforeAt}@${user.name} `; // 유저 이름으로 대체
      setCommentInput(newInput);
    }

    setSelectedUser({
      isMentioned: true,
      receiverId: user.employeeId,
      receiverName: user.name,
    });

    setMentionList([]); // 멘션 리스트 초기화
  };

  // 댓글 작성 버튼 클릭 함수
  const handleSendClick = async () => {
    if (commentInput.trim() === '') {
      return;
    }

    try {
      // 댓글 작성 api 호출
      const commentData = {
        content: commentInput,
        receiverInfo: selectedUser,
        projectId: projectId,
        requirementId: requirementId,
      };
      createComment(data[0].userThreadId, commentData);
      setCommentInput('');
      setSelectedUser({
        isMentioned: false,
        receiverId: '',
        receiverName: '',
      });
      updateCommentList(); // 상태 플립하여 useEffect 트리거
      setHasNewComment(!hasNewComment); // 새로운 댓글 실시간 렌더링 트리거
    } catch (error) {
      console.log('댓글 작성 실패 : ', error);
    }
  };

  // 요구사항 잠금 버튼 클릭 함수
  const handleLockButtonClick = () => {
    setAlertModalProps({
      text: '스레드는 다시 잠금을 풀 수 없습니다. 작성한 내용을 확정하시겠어요?',
      buttonsType: 'yesno',
      status: 'warning',
      closeModal: () => setIsAlertOpen(false),
      onConfirm: handleThreadLock,
    });
    setIsAlertOpen(true);
  };

  // 요구사항 잠금 함수
  const handleThreadLock = async () => {
    try {
      await lockThread(data[0].userThreadId);
      setAlertModalProps({
        text: '스레드 잠금 성공',
        buttonsType: 'autoclose',
        status: 'success',
        closeModal: () => setIsAlertOpen(false),
        onConfirm: undefined,
      });
      setIsAlertOpen(true);
    } catch (error) {
      console.log('요구사항 잠금 실패 : ', error);
    }
  };

  const handleInputFocus = (id: number) => {
    setActiveThreadId(id); // id 직접 전달
  };

  const handleInputBlur = () => {
    setActiveThreadId(null); // null 직접 전달
  };

  useEffect(() => {
    const handleFetchUsers = async () => {
      const users = await getUserByProject(projectId);
      setAllUsers(users.data);
    };

    handleFetchUsers();
  }, [projectId]);

  return (
    <>
      {/* 알림 모달 */}
      {isAlertOpen && (
        <AlertModal
          text={alertModalProps.text}
          buttonsType={alertModalProps.buttonsType}
          status={alertModalProps.status}
          closeModal={alertModalProps.closeModal}
          onConfirm={alertModalProps.onConfirm}
        />
      )}
      {data.length > 0 && (
        <div
          className={`mb-4 flex max-h-[50vh] w-full flex-col items-center rounded bg-white p-4 shadow transition duration-500 ${selected ? 'mb-6 -translate-x-3 scale-105 border shadow-lg' : ''}`}>
          {/* 타이틀 */}
          <div className='flex w-full items-center justify-between border-b pb-3'>
            <div className='flex items-center'>
              <Profile
                width='2.5rem'
                height='2.5rem'
                name={data[0].threadAuthorInfo.name}
                profileColor={data[0].threadAuthorInfo.profileColor}
              />
              <div className='ml-1 text-lg font-normal'>의 스레드</div>
            </div>

            {/* 잠금 버튼 */}
            <div className='flex h-8 w-8 items-center justify-center rounded border'>
              {data[0].isLocked === 'y' ? (
                // 스레드가 lock 일 때
                <Locked className='h-5 w-5 stroke-gray-400' />
              ) : data[0].isLocked === 'n' &&
                employeeId === data[0].threadAuthorInfo.employeeId ? (
                // 요구사항이 unlock 이고 스레드 작성자일 때
                <Unlocked
                  className='h-5 w-5 cursor-pointer stroke-gray-400 hover:stroke-gray-600'
                  onClick={handleLockButtonClick}
                />
              ) : (
                // 요구사항이 unlock 이고 담당자가 아닐 때
                <Unlocked className='h-5 w-5 stroke-gray-400' />
              )}
            </div>
          </div>

          {/* 댓글 조회 */}
          <ul
            className='my-5 max-h-72 w-full overflow-y-auto px-3'
            ref={scrollRef}>
            {data[0].commentList.length === 0 && (
              <p className='text-center'>댓글이 없습니다.</p>
            )}
            {data[0].commentList.map((comment) => (
              <li
                key={comment.commentId}
                className='mb-6 flex items-center last-of-type:mb-0'>
                <Profile
                  width='2rem'
                  height='2rem'
                  name={comment.commentAuthorInfo.name}
                  profileColor={comment.commentAuthorInfo.profileColor}
                />
                <div className='mx-2 w-full rounded-md bg-gray-50 p-2 text-sm'>
                  {comment.content}
                </div>
              </li>
            ))}
          </ul>

          {/* 댓글 작성 */}
          {data[0].isLocked === 'n' && !isRequirementLocked && (
            <>
              <div className='relative flex w-full items-center' ref={inputRef}>
                <input
                  type='text'
                  placeholder='댓글 달기'
                  className=' mr-2 h-10 w-full rounded border-2 border-gray-200 p-2 focus:outline-pubble'
                  value={commentInput}
                  onChange={handleInputChange}
                  onFocus={() => {
                    handleInputFocus(data[0].userThreadId);
                  }}
                  onBlur={handleInputBlur}
                />
                <button
                  className='flex h-9 w-9 shrink-0 items-center justify-center rounded bg-pubble p-2 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
                  onClick={handleSendClick}>
                  <Pencil />
                </button>
                {mentionList.length > 0 && (
                  <ul
                    className='absolute left-0 right-0 top-full z-10 mt-1 list-none border bg-white'
                    css={dropdownStyle}>
                    {mentionList.map((user) => (
                      <li
                        key={user.employeeId}
                        className='cursor-pointer p-2 hover:bg-gray-100'
                        onClick={() => handleUserSelect(user)}>
                        {user.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Thread;
