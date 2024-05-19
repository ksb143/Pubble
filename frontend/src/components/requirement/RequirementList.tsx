// 1. react 관련
import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library
// 3. api
import { updateRequirementLockStatus } from '@/apis/project';
import { requestConfirm } from '@/apis/confirm';
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
  const { setPageType } = usePageInfoStore();

  const navigate = useNavigate();
  const { projectCode, projectId } = usePageInfoStore();
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
  const handleConfirm = async (
    event: React.MouseEvent,
    requirement: Requirement,
  ) => {
    event.stopPropagation();
    const reqId = requirement.requirementId; // 선택된 row의 requirementId
    const requestBody = {
      projectId: projectId,
      isLock: requirement.isLock,
      approval: requirement.approval,
      requirementName: requirement.requirementName,
      approvalComment: requirement.approvalComment || '',
    };
    try {
      const response = await requestConfirm(reqId, requestBody);
      if (response.message === 'Confirm Complete') {
        console.log('승인 허가', response);
      } else if (response.message === 'Confirm Hold') {
        console.log('승인 보류', response);
      } else {
        console.log('승인 요청 실패', response);
      }
    } catch (error) {
      console.error('Failed to request confirm:', error);
    }
  };

  const handleLock = async (
    event: React.MouseEvent,
    requirement: Requirement,
  ) => {
    event.stopPropagation();
    const reqId = requirement.requirementId; // 선택된 row의 requirementId
    try {
      const response = await updateRequirementLockStatus(projectId, reqId);
      if (response.data) {
        console.log('잠금 상태 변경');
      } else {
        console.log('잠금 상태 변경 실패', response);
      }
    } catch (error) {
      console.error('Failed to update lock status:', error);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRequirementClick = (
    requirementId: number,
    requirementCode: string,
    requirementName: string,
  ) => {
    if (!requirementId || !projectCode) {
      console.error('Invalid project data');
      return;
    }
    setPageType('requirement', {
      requirementId,
      requirementCode,
      requirementName,
    });

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
                승인여부
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
                className='break border-gray-2000 h-16 cursor-pointer whitespace-normal break-keep border-t hover:bg-gray-100'
                onClick={() =>
                  handleRequirementClick(
                    requirement.requirementId,
                    requirement.code,
                    requirement.requirementName,
                  )
                }
                key={requirement.requirementId}>
                <td className='px-4 py-2'>
                  {requirement.approval === 'a' ? (
                    <button
                      className='rounded bg-gray-500 px-3 py-1 text-sm text-white'
                      disabled={true}>
                      승인완료
                    </button>
                  ) : requirement.isLock === 'l' ? (
                    <button
                      className='rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600'
                      onClick={(event) => {
                        event.stopPropagation();
                        handleConfirm(event, requirement);
                      }}>
                      승인대기
                    </button>
                  ) : (
                    <button
                      className='rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600'
                      onClick={(event) => {
                        event.stopPropagation();
                        handleLock(event, requirement);
                      }}>
                      잠금대기
                    </button>
                  )}
                </td>
                <td className='px-4 py-2'>{requirement.code}</td>
                <td className='p-2 px-4 text-start'>
                  {requirement.requirementName}
                </td>
                <td className='px-4 py-2'>
                  {requirement.detail ? (
                    <ul>
                      {requirement.detail.map((detail) => (
                        <li key={detail.requirementDetailId}>
                          {detail.content}
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
                          event.stopPropagation();
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
