// 1. react 관련
// 2. library
// 3. api
// 4. store
// 5. components
import { useState } from 'react';
import { addProject } from '@/apis/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  // DialogTrigger,
} from '@/components/ui/dialog';

interface ProjectAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectAddModal = ({ isOpen, onClose }: ProjectAddModalProps) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [participant, setParticipant] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  const handleAddProject = async () => {
    const participantsArray = participant.split(',').map((part) => part.trim());
    console.log('api 호출시작');
    try {
      await addProject(title, code, participantsArray, startAt, endAt);
      console.log('api 호출 성공');
      onClose(); // 프로젝트 생성 후 모달 닫기
    } catch (error) {
      console.error('api 호출 실패', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild></DialogTrigger> */}
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>프로젝트 생성</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='projectTitle' className='text-right'>
              이름
            </Label>
            <Input
              id='projectTitle'
              placeholder='ex) 올리브올드 홈페이지'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='projectCode' className='text-right'>
              CODE
            </Label>
            <Input
              id='projectCode'
              placeholder='ex) OliveOld'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='participant' className='text-right'>
              참여자
            </Label>
            <Input
              id='projectParticipant'
              placeholder='ex) SSAFY1001, SSAFY1002'
              type='text'
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='startAt' className='text-right'>
              시작일
            </Label>
            <Input
              id='startAt'
              type='date'
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='endAt' className='text-right'>
              종료일
            </Label>
            <Input
              id='endAt'
              type='date'
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className='col-span-3'
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddProject}>생성</Button>
            <Button onClick={onClose}>취소</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAddModal;
