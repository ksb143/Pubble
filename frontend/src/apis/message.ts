import { privateApi } from '@/utils/http-commons.ts';

// 쪽지 보내기 함수
export const sendMessage = async (
  employeeId: string,
  title: string,
  content: string,
) => {
  console.log('보내기 api', employeeId, title, content);
  const { data } = await privateApi.post(`/messages/${employeeId}`, {
    title: title,
    content: content,
  });
  return data;
};
