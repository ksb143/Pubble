import { privateApi } from '@/utils/http-commons.ts';

// 받은 쪽지 리스트 조회 함수
export const getMessageList = async (page: number, size: number) => {
  const { data } = await privateApi.get('/messages/received', {
    params: { page, size },
  });
  return data;
};

// 쪽지를 읽었을 때 상태를 변경하는 함수
export const updateMessageStatus = async (
  messageId: number,
  status: string,
) => {
  const { data } = await privateApi.put(`/messages/${messageId}`, { status });
  return data;
};

// 쪽지 보내기 함수
export const sendMessage = async (
  employeeId: string,
  title: string,
  content: string,
) => {
  await privateApi.post(`/messages`, {
    employeeId: employeeId,
    title: title,
    content: content,
  });
};
