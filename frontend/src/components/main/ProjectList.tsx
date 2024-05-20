// 1. react 관련
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library 관련
// 3. api 관련
import { getProject } from '@/apis/project';
// 4. store 관련
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. components 관련
import ProjectAddModal from '@/components/main/ProjectAddModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// 6. etc
import EllipsisVerticalIcon from '@/assets/icons/ellipsis-vertical.svg?react';

interface Project {
  projectId: number;
  prdId: string;
  startAt: string;
  endAt: string;
  projectTitle: string;
  people: number;
  progressRatio: number; // 프로젝트 진행률(실수)
  status: 'in progress' | 'complete' | 'before start'; // 프로젝트 상태
}

interface ProjectListProps {
  openProjectStatus: (projectId: number) => void;
}

const ProjectList = ({ openProjectStatus }: ProjectListProps) => {
  const navigate = useNavigate();
  const { setPageType } = usePageInfoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProject();
        if (response.data && response.data.length > 0) {
          const projectData = response.data.map((project: Project) => ({
            projectId: project.projectId,
            prdId: project.prdId,
            startAt: project.startAt,
            endAt: project.endAt,
            projectTitle: project.projectTitle,
            people: project.people,
            progressRatio: project.progressRatio,
            status: project.status,
          }));
          setProjects(projectData);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // 필터링 처리
  useEffect(() => {
    const results = projects.filter((project) =>
      project.projectTitle.toLowerCase().includes(filter.toLowerCase()),
    );
    setFilteredProjects(results);
    setCurrentPage(1); // 필터링 후 페이지를 1로 재설정
  }, [filter, projects]);

  // 페이지네이션 처리
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const handleNext = () => {
    if (currentPage < Math.ceil(projects.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 특정 프로젝트 클릭 프로젝트 페이지로 이동 함수
  const handleProjectClick = (
    projectId: number,
    prdId: string,
    projectTitle: string,
  ) => {
    if (!projectId || !prdId || !projectTitle) {
      console.error('Invalid project data');
      return;
    }
    setPageType('project', {
      projectId: projectId,
      projectCode: prdId,
      projectName: projectTitle,
    });
    navigate(`/project/${prdId}`);
  };

  // 프로젝트 상태 보여주기
  const showProjectStatus = (
    event: React.MouseEvent<HTMLElement>,
    projectId: number,
  ) => {
    event.stopPropagation();
    openProjectStatus(projectId);
  };

  return (
    <div className='w-full'>
      <div>
        <ProjectAddModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <div className='mb-2 flex justify-between'>
          <input
            placeholder='프로젝트명을 입력해주요.'
            className='h-10 w-96 rounded border border-gray-200 px-4 focus:outline-none'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={() => setIsModalOpen(true)}>프로젝트 추가</Button>
        </div>
        <div className='mt-4 h-[30rem] overflow-y-auto'>
          <table className='w-full text-center'>
            <thead className='whitespace-nowrap text-lg'>
              <tr>
                <th className='sticky top-0 z-[5] bg-gray-200 px-4 py-2'>
                  프로젝트 코드
                </th>
                <th className='sticky top-0 z-[5] bg-gray-200 px-4 py-2'>
                  프로젝트 이름
                </th>
                <th className='sticky top-0 z-[5] bg-gray-200 p-2'>구성원</th>
                <th className='sticky top-0 z-[5] bg-gray-200 p-2'>진행률</th>
                <th className='sticky top-0 z-[5] bg-gray-200 px-4 py-2'>
                  상태
                </th>
                <th className='sticky top-0 z-[5] bg-gray-200 px-4 py-2'>
                  시작일
                </th>
                <th className='sticky top-0 z-[5] bg-gray-200 px-4 py-2'>
                  종료일
                </th>
                <th className='sticky top-0 z-[5] bg-gray-200 px-4 py-2'></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((project) => (
                <tr
                  className='break h-16 cursor-pointer whitespace-normal break-keep border-t border-gray-200 hover:bg-gray-100'
                  onClick={() =>
                    handleProjectClick(
                      project.projectId,
                      project.prdId,
                      project.projectTitle,
                    )
                  }
                  key={project.projectId}>
                  <td className='px-4 py-2'># {project.prdId}</td>
                  <td className='px-4 py-2 text-start'>
                    {project.projectTitle}
                  </td>
                  <td className='p-2'>{Object.keys(project.people).length}</td>
                  <td className='p-2'>
                    {Math.round(project.progressRatio * 100)}%
                  </td>
                  <td className='px-4 py-2'>{project.status}</td>
                  <td className='px-4 py-2'>
                    {project.startAt.substring(0, 10)}
                  </td>
                  <td className='px-4 py-2'>
                    {project.endAt.substring(0, 10)}
                  </td>
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
                            showProjectStatus(event, project.projectId);
                          }}>
                          프로젝트 진행 상태
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          disabled={currentPage >= Math.ceil(projects.length / itemsPerPage)}>
          다음
        </button>
      </div>
    </div>
  );
};

export default ProjectList;
