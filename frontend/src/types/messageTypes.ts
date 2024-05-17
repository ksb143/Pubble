// 쪽지 관련 타입 정의

// 쪽지 보내는 사람 정보
export interface SenderInfo {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  role: string; // 관리자 여부
  isApprovable: 'y' | 'n'; // 결재자 여부
  profileColor: string;
}

// 쪽지 받는 사람 정보
export interface ReceiverInfo {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  role: string;
  isApprovable: 'y' | 'n';
  profileColor: string;
}

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
