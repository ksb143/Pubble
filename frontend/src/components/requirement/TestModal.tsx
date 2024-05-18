import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestModal = ({ isOpen, onClose }: TestModalProps) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>요구사항 생성</DialogTitle>
          </DialogHeader>
          <p>요구사항 생성 모달의 내용</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestModal;
