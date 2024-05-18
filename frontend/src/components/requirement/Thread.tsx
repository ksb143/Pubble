// 1. react
import { useState } from 'react';
// 2. library
// 3. api
import { ThreadInfo } from '@/types/requirementTypes';
// 4. store
// 5. component
// 6. asset

// api로 받아온 스레드 타입 설정
interface ThreadProps {
  data: ThreadInfo;
}

const Thread: React.FC<ThreadProps> = ({ data }) => {
  const [commentInput, setCommentInput] = useState('');

  return (
    <div className='h-fit max-h-96 w-1/4 rounded bg-white p-4 shadow'>
      <div className='mb-2 text-lg font-normal'>스레드</div>
      <div>
        {data.commentList.map((comment) => (
          <div key={comment.commentId} className='mb-2 flex items-center'>
            {/* 댓글 작성 유저 프로필 */}
            <div className='ml-2 text-sm'>{comment.content}</div>
          </div>
        ))}
      </div>
      <input
        type='text'
        placeholder='댓글을 입력해주세요'
        className='h-10 w-full rounded border-2 border-gray-200 p-2 focus:outline-pubble'
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
      />
    </div>
  );
};

export default Thread;
