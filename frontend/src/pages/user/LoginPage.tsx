import { useState } from 'react';
import Lottie from 'react-lottie';
import { login } from '@/apis/user';
import loginAnimation from '@/assets/lotties/login.json';

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isEmployeeId, setIsEmployeeId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  // 로티 기본 옵션
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // 로그인 함수
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!employeeId) {
      setIsEmployeeId(true);
      return;
    }
    if (!password) {
      setIsPassword(true);
      return;
    }
    try {
      const data = await login(employeeId, password);
      localStorage.setItem('accessToken', data.resData.accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex grid h-screen grid-cols-12 items-center'>
      <div className='col-span-5 col-start-2'>
        <div className='mb-10'>
          <p className='text-2xl font-normal'>로그인</p>
          <p className='text-4xl font-semibold'>
            개발자와 기획자간의 연결 창, Pubble
          </p>
          <p className='text-2xl font-normal'>
            계정에 접근하려면, 로그인이 필요합니다
          </p>
        </div>
        <form onSubmit={handleLogin} className='mb-10'>
          <div className='mb-5'>
            <p>사번</p>
            <input
              className='h-12 w-full rounded border-2 border-gray-200 p-2 focus:outline-pubble'
              type='text'
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            {isEmployeeId && (
              <p className='text-sm text-red-600'>사번을 입력해주세요</p>
            )}
          </div>
          <div className='mb-5'>
            <div className='flex justify-between'>
              <p>비밀번호</p>
              <p className='text-sm text-pubble'>
                비밀번호를 잃어버렸나요? 관리자에게 문의하세요
              </p>
            </div>
            <input
              className='h-12 w-full rounded border-2 border-gray-200 p-2 focus:outline-pubble'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isPassword && (
              <p className='text-sm text-red-600'>비밀번호를 입력해주세요</p>
            )}
          </div>
          <button
            type='submit'
            className='rounded bg-pubble px-4 py-2 text-white'>
            로그인
          </button>
        </form>
      </div>
      <div className='col-span-5 col-start-7'>
        <Lottie options={defaultOptions} height={500} width={500} />{' '}
      </div>
    </div>
  );
};

export default LoginPage;
