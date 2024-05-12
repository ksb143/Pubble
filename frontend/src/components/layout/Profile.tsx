/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import useUserStore from '@/stores/userStore';

interface ProfileProps {
  width: string; // 예: '48px'
  height: string; // 예: '48px'
}

const Profile = ({ width = '3rem', height = '3rem' }: ProfileProps) => {
  // ToDo : 현재는 로그인한 유저의 정보로 설정
  // 추후에는 props로 유저의 정보를 받아와야함
  const { name, profileColor, textColor } = useUserStore();

  const profileStyle = css`
    display: flex;
    height: ${height};
    width: ${width};
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background-color: ${profileColor};
    color: ${textColor};
  `;

  return (
    <>
      <div css={profileStyle}>
        <div className='font-normal'>{name}</div>
      </div>
    </>
  );
};

export default Profile;
