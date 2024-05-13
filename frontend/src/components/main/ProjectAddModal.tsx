import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent,  DialogTrigger, } from '@radix-ui/react-dialog'

interface ProjectAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectAddModal({ isOpen, onClose }: ProjectAddModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectTitle" className="text-right">프로젝트 이름</Label>
            <Input
              id="projectTitle"
              defaultValue="홈페이지 제작"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectCode" className="text-right">프로젝트 Code</Label>
            <Input
              id="projectCode"
              defaultValue="homepage"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectParticipant" className="text-right">프로젝트 참여자</Label>
            <Input
              id="projectParticipant"
              defaultValue="SSAFY1001"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startAt" className="text-right">시작일</Label>
            <Input
              id="startAt"
              defaultValue="2024-03-01"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endAt" className="text-right">종료일</Label>
            <Input
              id="endAt"
              defaultValue="2024-03-02"
              className="col-span-3"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectAddModal;