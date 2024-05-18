// 1. react 관련
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 2. library 관련
// 3. api 관련
import { getProject } from '@/apis/project';
// 4. store 관련
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. components 관련
import ProjectAddModal from '@/components/main/ProjectAddModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const ProjectList = () => {
  const navigate = useNavigate();
  const { setPageType } = usePageInfoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

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

  return (
    <div>
      <div>
        <ProjectAddModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <div className='mb-2 flex justify-between'>
          <Input
            placeholder='프로젝트 이름을 입력해주요.'
            className='max-w-sm'
          />
          <Button onClick={() => setIsModalOpen(true)}>프로젝트 추가</Button>
        </div>
        <table>
          <thead>
            <tr>
              <th>프로젝트 코드</th>
              <th>프로젝트 이름</th>
              <th>구성 인원</th>
              <th>진행률</th>
              <th>상태</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>상세 상태</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                onClick={() =>
                  handleProjectClick(
                    project.projectId,
                    project.prdId,
                    project.projectTitle,
                  )
                }
                key={project.projectId}>
                <td>{project.prdId}</td>
                <td>{project.projectTitle}</td>
                <td>{project.people}</td>
                <td>{(project.progressRatio * 100).toFixed(2)}%</td>
                <td>{project.status}</td>
                <td>{project.startAt}</td>
                <td>{project.endAt}</td>
                <td>
                  <EllipsisVerticalIcon className='h-5 w-5 hover:cursor-pointer' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
