// 1. react 관련
import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. components
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
// 6. etc
import EllipsisVerticalIcon from '@/assets/icons/ellipsis-vertical.svg?react';

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

interface Requirement {
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

interface RequirementListProps {
  requirements: Requirement[];
}

const RequirementList = ({ requirements }: RequirementListProps) => {
  const navigate = useNavigate();
  const { projectCode } = usePageInfoStore();
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지네이션 처리
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requirements.slice(indexOfFirstItem, indexOfLastItem);
  const handleNext = () => {
    if (currentPage < Math.ceil(requirements.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRequirementClick = (requirementCode: string) => {
    if (!requirementCode || !projectCode) {
      console.error('Invalid project data');
      return;
    }
    navigate(`/project/${projectCode}/requirement/${requirementCode}`);
  };

  const showRequirementHistory = (
    event: MouseEvent,
    requirementCode: string,
  ) => {
    event.stopPropagation();
    console.log('showRequirementHistory', requirementCode);
  };

  return (
    <div className='w-full'>
      <div className='mt-4 h-[30rem] w-full overflow-y-auto'>
        <table className='w-full text-center'>
          <thead className='whitespace-nowrap text-lg'>
            <tr>
              <th className='sticky top-0 z-10 bg-gray-200 px-4 py-2'>
                잠금 여부
              </th>
              <th className='sticky top-0 z-10 bg-gray-200 px-4 py-2'>코드</th>
              <th className='sticky top-0 z-10 bg-gray-200 p-2'>요구사항명</th>
              <th className='sticky top-0 z-10 bg-gray-200 p-2'>상세설명</th>
              <th className='sticky top-0 z-10 bg-gray-200 px-4 py-2'>
                담당자
              </th>
              <th className='sticky top-0 z-10 bg-gray-200 px-4 py-2'>
                작성자
              </th>
              <th className='sticky top-0 z-10 bg-gray-200 px-4 py-2'>버전</th>
              <th className='sticky top-0 z-10 bg-gray-200 px-4 py-2'></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((requirement: Requirement) => (
              <tr
                className='break h-16 cursor-pointer whitespace-normal break-keep border-t border-gray-200 hover:bg-gray-100'
                onClick={() => handleRequirementClick(requirement.code)}
                key={requirement.requirementId}>
                <td className='px-4 py-2'># {requirement.isLock}</td>
                <td className='px-4 py-2'>{requirement.code}</td>
                <td className='p-2 px-4 text-start'>
                  {requirement.requirementName}
                </td>
                <td className='px-4 py-2'>
                  {requirement.detail ? (
                    <ul>
                      {requirement.detail.map((contentInfo: Detail) => (
                        <li key={contentInfo.requirementDetailId}>
                          {contentInfo.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    '상세설명이 없습니다'
                  )}
                </td>
                <td className='px-4 py-2'>{requirement.manager.name}</td>
                <td className='px-4 py-2'>{requirement.author.name}</td>
                <td className='px-4 py-2'>{requirement.version}</td>
                <td
                  className='px-4 py-2'
                  onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className='outline-none'>
                        <EllipsisVerticalIcon className='h-5 w-5 hover:cursor-pointer' />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-fit'>
                      <DropdownMenuCheckboxItem
                        className='px-3 hover:cursor-pointer'
                        onClick={(event) => {
                          showRequirementHistory(event, requirement.code);
                        }}>
                        버전 히스토리
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='my-4 flex w-full justify-end'>
        <button
          className='mr-3 rounded border border-gray-200 bg-white px-4 py-2'
          onClick={handlePrevious}
          disabled={currentPage === 1}>
          이전
        </button>
        <button
          className='rounded border border-gray-200 bg-white px-4 py-2'
          onClick={handleNext}
          disabled={
            currentPage >= Math.ceil(requirements.length / itemsPerPage)
          }>
          다음
        </button>
      </div>
    </div>
  );
};

export default RequirementList;
