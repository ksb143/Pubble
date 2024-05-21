// 요구사항 페이지 관련 타입 정의
import { UserInfo } from '@/types/userType';

// 요구사항 상세 항목 리스트
export interface RequirementDetail {
  requirementDetailId: number;
  content: string;
  status: 'u' | 'd'; // 'u'는 활성화, 'd'는 비활성화
}

// 작성자 유저 정보
export type Author = UserInfo;

// 담당자 유저 정보
export type Manager = UserInfo;

// 서버에서 보내는 요구사항 정보
export interface RequirementInfo {
  requirementId: number;
  orderIndex: number;
  version: string;
  isLock: 'l' | 'u'; // 'l'은 locked, 'u'는 unlocked
  approval: 'u' | 'a' | 'h'; // 'u'는 초기값, 'a'는 approved 승인, 'h'는 hold 보류
  approvalComment: string; // 승인 또는 보류 이유
  code: string;
  requirementName: string;
  details: RequirementDetail[];
  manager: Manager; // 담당자
  targetUser: string;
  createdAt: string;
  author: Author; // 작성자
}
