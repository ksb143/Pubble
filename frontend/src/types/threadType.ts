// 스레드 관련 타입 정의
import { UserInfo } from '@/types/userType';

// 댓글 정보
export interface Comment {
  commentId: number;
  userId: number;
  content: string;
  commentAuthorInfo: UserInfo;
}

// 스레드 한 개의 정보
export interface ThreadInfo {
  userThreadId: number;
  commentList: Comment[];
  isLocked: 'y' | 'n';
  threadAuthorInfo: UserInfo;
}

// 서버에서 보내는 스레드 정보
export interface ThreadListInfo {
  detailId: number;
  userThreadDtos: ThreadInfo[];
}

// 댓글 작성 api에 전달할 받는사람 정보
export interface ReceiverInfo {
  isMentioned: boolean;
  receiverId: string;
  receiverName: string;
}

// 댓글 작성 api에 전달할 댓글 정보
export interface CommentData {
  content: string;
  receiverInfo: ReceiverInfo;
  projectId: number;
  requirementId: number;
}
