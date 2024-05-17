/** @jsxImportSource @emotion/react */
// 1. react
// 2. library
import { css } from '@emotion/react';
// 3. api
import { getTextColor } from '@/utils/profile';
// 4. store
// 5. component
// 6. assets

// 프로필 타입 정의
interface ProfileProps {
  width: string; // 단위 포함, 예: '3rem'
  height: string; // 단위 포함, 예: '3rem'
  name: string;
  profileColor: string;
}

const Profile = ({ width, height, name, profileColor }: ProfileProps) => {
  const textColor = getTextColor(profileColor); // 프로필 배경색에 따른 텍스트 색상 설정

  // 프로필 스타일
  const profileStyle = css`
    display: flex;
    height: ${height};
    width: ${width};
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background-color: ${profileColor};
    color: ${textColor};
    flex-shrink: 0;
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
