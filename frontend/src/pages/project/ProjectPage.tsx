// 1. react 관련
import { useEffect, useState } from 'react';
// 2. library 관련
// 3. api 관련
import { getLatestRequirementVersion } from '@/apis/project';
// 4. store 관련
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component 관련
import RequirementList from '@/components/requirement/RequirementList';
import RequirementAddModal from '@/components/requirement/RequirementAddModal.tsx';

interface Person {
  name: string;
  employeeId: string;
  department: string;
  position: string;
  role: string;
  isApprovable: 'y' | 'n';
  profileColor: string;
}

interface Detail {
  requirementDetailId: number;
  content: string;
  status: 'u' | 'd';
}

interface Summary {
  requirementId: number;
  orderIndex: number;
  version: string;
  isLock: 'u' | 'l';
  approval: 'u' | 'h' | 'a';
  approvalComment: string | null;
  detail: Detail[];
  manager: Person;
  targetUse: string;
  createdAt: string;
  author: Person;
  requirementName: string;
  code: string;
}

interface Requirement {
  projectId: number;
  projectTitle: string;
  startAt: string;
  endAt: string;
  status: string;
  code: string;
  people: Person[];
  requirementSummaryDtos: Summary[];
}

const ProjectPage = () => {
  const { projectId, setPageType } = usePageInfoStore((state) => ({
    projectId: state.projectId,
    projectCode: state.projectCode,
    projectName: state.projectName,
    setPageType: state.setPageType,
  }));
  const [requirementList, setRequirementList] = useState<Requirement | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getRequirementList = async () => {
      const response = await getLatestRequirementVersion(projectId);
      const { data } = response;
      if (data) {
        setPageType('project', {
          projectId: data.projectId,
          projectCode: data.code,
          projectName: data.projectTitle,
        });
      }
      setRequirementList(data);
    };
    getRequirementList();
  }, []);

  // Date 변환 코드
  const dateParse = (date: string) => {
    if (date) {
      const dateParts = date.split('T')[0].split('-');
      return `${dateParts[0]}.${dateParts[1]}.${dateParts[2]}`;
    }
  };

  return (
    <div className='p-4'>
      {isOpen && (
        <RequirementAddModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}
      <h1 className='mb-2 text-center text-2xl font-extrabold'>
        {requirementList?.projectTitle}
      </h1>
      <div className='text-center text-lg'>
        {requirementList?.startAt ? dateParse(requirementList.startAt) : ''} ~
        {requirementList?.endAt ? dateParse(requirementList.endAt) : ''}
      </div>
      <div className='mx-1 flex justify-between'>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className='rounded bg-pubble px-4 py-2 text-white hover:bg-dpubble hover:shadow-custom'>
          요구사항 생성
        </button>
        <button className='rounded border border-gray-200 bg-white px-4 py-2 hover:shadow-custom'>
          정렬
        </button>
      </div>
      {requirementList?.requirementSummaryDtos && (
        <RequirementList
          requirements={requirementList.requirementSummaryDtos}
        />
      )}
    </div>
  );
};

export default ProjectPage;
