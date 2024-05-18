// 1. react
import { useState } from 'react';
// 2. library
// 3. api
import { ThreadInfo } from '@/types/requirementTypes';
// 4. store
// 5. component
import Profile from '@/components/layout/Profile';
// 6. asset
import Locked from '@/assets/icons/lock-closed.svg?react';
import Unlocked from '@/assets/icons/lock-open.svg?react';
import Pencil from '@/assets/icons/pencil.svg?react';

// api로 받아온 스레드 타입 설정
interface ThreadProps {
  data: ThreadInfo;
}

const Thread: React.FC<ThreadProps> = ({ data }) => {
  const [commentInput, setCommentInput] = useState('');

  return (
    <>
      <div className='flex h-fit max-h-[50vh] w-1/4 flex-col justify-center rounded bg-white p-4 shadow'>
        {/* 타이틀 */}
        <div className='flex w-full items-center justify-between border-b pb-3 text-lg font-normal'>
          <div className='flex items-center'>
            <Profile
              width='2.5rem'
              height='2.5rem'
              name={data.threadAuthorInfo.name}
              profileColor={data.threadAuthorInfo.profileColor}
            />
            <div className='ml-1'>의 스레드</div>
          </div>
          {/* 잠금 여부 */}
          <div className='flex items-center'>
            <div className='mx-2 flex h-8 w-8 shrink-0 items-center justify-center rounded border-2 border-gray-200 bg-gray-50'>
              <Locked className='h-4 w-4 stroke-1' />
            </div>
            <div className='mx-2 flex h-8 w-8 shrink-0 items-center justify-center rounded border-2 border-gray-200 bg-gray-50'>
              <Unlocked className='h-4 w-4 stroke-1' />
            </div>
          </div>
        </div>
        {/* 댓글 조회 */}
        <div className='mx-2 my-5 max-h-72 overflow-y-auto'>
          {data.commentList.map((comment) => (
            <div
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
            </div>
          ))}
        </div>
        {/* 댓글 작성 */}
        <div className='flex items-center'>
          <input
            type='text'
            placeholder='댓글을 입력해주세요'
            className='mr-2 h-10 w-full rounded border-2 border-gray-200 p-2 focus:outline-pubble'
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button className='flex h-9 w-9 shrink-0 items-center justify-center rounded bg-pubble p-2 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'>
            <Pencil />
          </button>
        </div>
      </div>
    </>
  );
};

export default Thread;
