import { useState } from 'react';
import Lottie from 'react-lottie';
import { AxiosError } from 'axios';
import { login } from '@/apis/user';
import loginAnimation from '@/assets/lotties/login.json';

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isEmployeeId, setIsEmployeeId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [error, setError] = useState('');

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
  const handleLogin = async () => {
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
      // 성공 후 페이지 리다이렉션 필요
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 401:
            setError('계정 정보가 일치하지 않습니다. 계정 정보를 확인해주세요');
            break;
          case 404:
            setError('사용자를 찾을 수 없습니다. 사번을 확인해주세요.');
            break;
          default:
            setError('알 수 없는 오류가 발생했습니다.');
            break;
        }
      } else {
        setError('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요');
      }
    }
    console.log(error);
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
        <div className='mb-10'>
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
          <div className='grid grid-cols-6'>
            <button
              onClick={handleLogin}
              type='button'
              className='col-span-1 col-start-6 grid rounded bg-pubble py-2 text-white hover:shadow-lg hover:outline-double hover:outline-4 hover:outline-gray-200'>
              로그인
            </button>
          </div>
        </div>
      </div>
      <div className='col-span-5 col-start-7'>
        <Lottie options={defaultOptions} height={500} width={500} />{' '}
      </div>
    </div>
  );
};

export default LoginPage;
