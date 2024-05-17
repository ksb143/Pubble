// 1. react
import { useState } from 'react';
// 2. library
// 3. api
// 4. store
// 5. component
// 6. asset

const Thread = () => {
  const [comment, setComment] = useState('');
  return (
    <div className='h-fit max-h-96 w-1/4 rounded bg-white p-4 shadow'>
      <div className='mb-2 text-lg font-normal'>스레드</div>
      <input
        type='text'
        placeholder='댓글을 입력해주세요'
        className='h-10 w-full rounded border-2 border-gray-200 p-2 focus:outline-pubble'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </div>
  );
};

export default Thread;
