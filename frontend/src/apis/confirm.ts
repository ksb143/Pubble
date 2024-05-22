import { privateApi } from '@/utils/http-commons.ts';

interface FullRequestBody {
  projectId: number;
  isLock: 'u' | 'l';
  approval: 'u' | 'h' | 'a';
  requirementName: string;
  approvalComment: string;
}

// lock된 요구사항의 confirm 요청 함수
export const requestConfirm = async (
  reqId: number,
  fullRequestBody: FullRequestBody,
) => {
  const response = await privateApi.post(
    `/requirements/confirm/${reqId}`,
    fullRequestBody,
  );
  return response.data;
};
