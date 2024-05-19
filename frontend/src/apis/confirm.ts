import { privateApi } from '@/utils/http-commons.ts';

// lock된 요구사항의 confirm 요청 함수
export const requestConfirm = async (
  reqId: number,
  requestBody: {
    projectId: number;
    isLock: 'u' | 'l';
    approval: 'u' | 'h' | 'a';
    requirementName: string;
    approvalComment: string;
  },
) => {
  const response = await privateApi.post(
    `/requirements/confirm/${reqId}`,
    requestBody,
  );
  return response.data;
};
