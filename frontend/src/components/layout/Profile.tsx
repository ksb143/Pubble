/** @jsxImportSource @emotion/react */
// 1. react
// 2. library
import { css } from '@emotion/react';
// 3. api
import { getTextColor } from '@/utils/profile';
// 4. store
// 5. component
// 6. asset

// 프로필 타입 정의
interface ProfileProps {
  width: string; // 단위 포함, 예: '3rem'
  height: string; // 단위 포함, 예: '3rem'
  name: string;
  profileColor: string;
  status?: 'online' | 'offline';
}

const Profile = ({
  width,
  height,
  name,
  profileColor,
  status = 'online',
}: ProfileProps) => {
  const textColor = getTextColor(profileColor); // 프로필 배경색에 따른 텍스트 색상 설정

  // 프로필 스타일
  const profileStyle = css`
    display: flex;
    height: ${height};
    width: ${width};
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    color: ${textColor};
    flex-shrink: 0;
  `;

  // 배경색 스타일
  const backgroundColor = css`
    background-color: ${profileColor};
  `;

  // 폰트 크기 스타일 정의
  const fontSizeStyles: { [key: string]: string } = {
    '2rem': 'text-xs',
    '2.5rem': 'text-sm',
    '3rem': 'text-base',
  };

  // tailwind 클래스 설정 및 초기값 설정
  const fontSizeClass = fontSizeStyles[height] || 'text-base';

  return (
    <>
      <div
        css={profileStyle}
        className={`absolute ${status === 'online' ? '' : 'border bg-white/50'}`}></div>
      <div css={[profileStyle, backgroundColor]}>
        <p className={`whitespace-nowrap font-normal ${fontSizeClass}`}>
          {name}
        </p>
      </div>
    </>
  );
};

export default Profile;
