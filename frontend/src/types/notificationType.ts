// 알림 관련 타입 정의

// 알림 보내는 사람 정보
export interface SenderInfo {
  name: string;
  employeeId: string;
  position: string;
  department: string;
  profileColor: string;
}

// 알림 타입 정보
export interface TypeData {
  projectId: number | undefined;
  projectCode: string | null;
  requirementId: number | undefined;
  requirementCode: string | null;
  threadId: string | null;
}

// 서버에서 보내는 알림 정보
export interface NotificationInfo {
  notificationId: number;
  isChecked: boolean; // 읽음 여부
  title: string;
  content: string;
  senderInfo: SenderInfo;
  createdAt: string;
  type: string; // 알림 타입
  typeData: TypeData; // 타입별 필요한 정보
}
