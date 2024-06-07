const { VITE_TIPTAP_APP_SECRET } = import.meta.env;
import { SignJWT } from 'jose';

export const generateJwt = async () => {
  try {
    const userId = await localStorage.getItem('userId');
    const newToken = await new SignJWT({ userId: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(new TextEncoder().encode(VITE_TIPTAP_APP_SECRET));
    return newToken;
  } catch (error) {
    console.error('JWT 생성 오류:', error);
    return '';
  }
};

export const renderDate = (date: Date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
};
