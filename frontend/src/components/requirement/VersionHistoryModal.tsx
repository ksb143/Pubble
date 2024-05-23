import React from 'react';
import Modal from 'react-modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

Modal.setAppElement('#root');

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {historyList.length > 0 ? (
            historyList.map((history, index) => (
              <div key={index} className='history-item'>
                <h3>{history.version}</h3>
                <p>{history.requirementName}</p>
                <p>Approval: {history.approval}</p>
                <p>Approval Comment: {history.approvalComment}</p>
                <p>Manager: {history.manager.name}</p>
                <p>Author: {history.author.name}</p>
                <p>
                  Created At: {new Date(history.createdAt).toLocaleString()}
                </p>
                <ul>
                  {history.details.map((detail) => (
                    <li key={detail.requirementDetailId}>{detail.content}</li>
                  ))}
                </ul>
              </div>
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
