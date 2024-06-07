// 1. react
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
import { AxiosError } from 'axios';
import Lottie from 'react-lottie';
// 3. api
import { login } from '@/apis/user';
// 4. store
import useUserStore from '@/stores/userStore';
// 5. component
import ErrorAlertModal from '@/components/layout/ErrorAlertModal.tsx';
// 6. assets
import loginAnimation from '@/assets/lotties/login.json';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginEmployeeId, setLoginEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isEmployeeId, setIsEmployeeId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const {
    setName,
    setProfileColor,
    setEmployeeId,
    setDepartment,
    setPosition,
    setAllowedDocumentNames,
    setUserId,
    setRole,
    setIsApprovable,
  } = useUserStore();

  // 로티 기본 옵션
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // jwt 디코드 함수
  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  };

  // 로그인 함수
  const handleLogin = async () => {
    if (!loginEmployeeId) {
      setIsEmployeeId(true);
      return;
    }
    if (!password) {
      setIsPassword(true);
      return;
    }
    try {
      const data = await login(loginEmployeeId, password);
      localStorage.setItem('accessToken', data.resData.accessToken);
      localStorage.setItem('userId', loginEmployeeId);
      const decodeToken = parseJwt(data.resData.accessToken);
      // 이름, id, 부서, 직급, 고유 색 스토어 설정
      setName(decodeToken.name);
      setEmployeeId(decodeToken.employeeId);
      setDepartment(decodeToken.department);
      setPosition(decodeToken.position);
      setProfileColor(decodeToken.profileColor);
      setAllowedDocumentNames(decodeToken.allowedDocumentNames);
      setUserId(decodeToken.userId);
      setUserId(decodeToken.userId);
      setRole(decodeToken.role);
      setIsApprovable(decodeToken.isApprovable);

      // 성공 후 페이지 리다이렉션
      navigate('/main');
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 401:
            setError(`계정 정보가 일치하지 않습니다. 
            계정 정보를 확인해주세요`);
            break;
          case 404:
            setError(`사용자를 찾을 수 없습니다. 
            사번을 확인해주세요.`);
            break;
          default:
            setError(`알 수 없는 오류가 발생했습니다.`);
            break;
        }
      } else {
        setError(`서버에 연결할 수 없습니다. 
        네트워크 상태를 확인해주세요`);
      }
      setIsError(true);
    }
  };

  // 에러 다이얼로그 닫기 함수
  const handleCloseDialog = () => {
    setError('');
    setIsError(false);
  };

  // 엔터키 입력 시 로그인 함수
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };
  return (
    <div
      className='mx-12 grid h-screen grid-cols-12 items-center'
      onKeyDown={handleKeyDown}>
      {isError && (
        <ErrorAlertModal isOpen={isError} closeDialog={handleCloseDialog}>
          {error}
        </ErrorAlertModal>
      )}
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
              value={loginEmployeeId}
              onChange={(e) => {
                setLoginEmployeeId(e.target.value);
                setIsEmployeeId(false);
                setIsPassword(false);
              }}
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
