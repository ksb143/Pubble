import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HistoryDetail {
  requirementDetailId: number;
  content: string;
  status: 'u' | 'd';
}

interface HistorySummary {
  requirementId: number;
  orderIndex: number;
  version: string;
  isLock: 'u' | 'l';
  approval: 'u' | 'h' | 'a';
  approvalComment: string | null;
  details: HistoryDetail[];
  manager: {
    name: string;
    employeeId: string;
    department: string;
    position: string;
    role: string;
    isApprovable: 'y' | 'n';
    profileColor: string;
  };
  targetUser: string;
  createdAt: string;
  author: {
    name: string;
    employeeId: string;
    department: string;
    position: string;
    role: string;
    isApprovable: 'y' | 'n';
    profileColor: string;
  };
  requirementName: string;
  code: string;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: HistorySummary[];
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  historyList,
}) => {
  const getApprovalStatus = (approval: 'u' | 'h' | 'a') => {
    switch (approval) {
      case 'h':
        return '보류';
      case 'a':
        return '승인';
      default:
        return '미승인';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>버전 이력</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {historyList.length > 0 ? (
            historyList.map((history, index) => (
              <React.Fragment key={index}>
                <div className='history-item'>
                  <div className='whitespace-break-spaces text-xl'>
                    {history.version}
                    <span className='ml-3 font-bold'>
                      {history.requirementName}
                    </span>
                  </div>

                  <p className='text-base'>
                    승인: {getApprovalStatus(history.approval)}
                  </p>
                  <p className='text-base'>
                    승인 내용: {history.approvalComment}
                  </p>
                  <p className='text-base'>담당자: {history.manager.name}</p>
                  <p className='text-base'>작성자: {history.author.name}</p>
                  <p className='text-base'>
                    생성일시: {new Date(history.createdAt).toLocaleString()}
                  </p>
                  <ul>
                    {history.details.map((detail) => (
                      <li key={detail.requirementDetailId}>
                        - {detail.content}
                      </li>
                    ))}
                  </ul>
                </div>
                {index < historyList.length - 1 && <hr className='my-4' />}{' '}
                {/* 구분선 추가 */}
              </React.Fragment>
            ))
          ) : (
            <p>No history available</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistoryModal;
