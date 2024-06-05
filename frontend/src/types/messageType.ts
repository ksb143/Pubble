// 쪽지 관련 타입 정의
import { UserInfo } from '@/types/userType';

// 쪽지 보내는 사람 정보
export type SenderInfo = UserInfo;

// 쪽지 받는 사람 정보
export type ReceiverInfo = UserInfo;

// 서버에서 보내는 쪽지 정보
export interface MessageInfo {
  messageId: number;
  title: string;
  content: string;
  status: 'u' | 'd' | 'r'; // u: unread, d: deleted, r: read
  createdAt: string;
  senderInfo: SenderInfo;
  receiverInfo: ReceiverInfo;
}
