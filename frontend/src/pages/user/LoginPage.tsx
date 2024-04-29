import Lottie from 'react-lottie';
import loginAnimation from '@/assets/lotties/login.json';

const LoginPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className='flex'>
      <div>
        <div>
          <p>로그인</p>
          <p>개발자와 기획자간의 연결 창, Pubble</p>
          <p>계정에 접근하려면, 로그인이 필요합니다</p>
        </div>
        <div>
          <p>사번</p>
          <input type='text' />
          <p>사번을 입력해주세요</p>
          <p>비밀번호</p>
          <input type='text' />
          <p>비밀번호를 입력해주세요</p>
        </div>
        <button>로그인</button>
      </div>
      <div>
        <Lottie options={defaultOptions} height={400} width={400} />{' '}
      </div>
    </div>
  );
};

export default LoginPage;
