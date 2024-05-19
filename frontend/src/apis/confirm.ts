import { privateApi } from '@/utils/http-commons.ts';

// lock된 요구사항의 confirm 요청 함수
export const requestConfirm = async (
  reqId: number,
  requestBody: {
    projectId: number;
    isLock: string;
    approval: string;
    requirementName: string;
    approvalComment: string;
  },
) => {
  // approvalComment를 '승인합니다'로 고정하여 요청 본문에 추가
  const fullRequestBody = {
    ...requestBody,
    isLock: 'l',
    approval: 'a',
    approvalComment: '승인합니다',
  };

  const response = await privateApi.post(
    `/requirements/confirm/${reqId}`,
    fullRequestBody,
  );
  return response.data;
};
