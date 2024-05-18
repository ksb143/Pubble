// 1. react 관련
import { useEffect, useState } from 'react';
// 2. library
// 3. api
import { getProjectStatus } from '@/apis/project.ts';
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. components
import ProjectList from '@/components/main/ProjectList';
import Calendar from '@/components/main/Calendar';
import ProjectStatusSheet from '@/components/main/ProjectStatusSheet';
// 6. image 등 assets

interface ProjectStatus {
  approveRatio?: number;
  completeRatio?: number;
  progressRatio?: number;
}

const MainDashboardPage = () => {
  const { setPageType } = usePageInfoStore();
  const [isProjectStatusSheet, setIsProjectStatusSheet] = useState(false);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>({});

  useEffect(() => {
    setPageType('init');
  }, []);

  const showProjectStatus = async (prjectId: number) => {
    const projectData = await getProjectStatus(prjectId);
    setProjectStatus({
      approveRatio: projectData.data.approveRatio,
      completeRatio: projectData.data.completeRatio,
      progressRatio: projectData.data.progressRatio,
    });
    setIsProjectStatusSheet(true);
  };

  return (
    <>
      <ProjectStatusSheet
        isOpen={isProjectStatusSheet}
        closeSheet={() => setIsProjectStatusSheet(false)}></ProjectStatusSheet>
      <div className='p-4'>
        <div className='flex items-center justify-center'>
          <div className='h-full w-1/3 items-center text-black'>
            <Calendar />
          </div>
          <div className='flex h-full w-2/3 items-center justify-center overflow-auto text-black'>
            <ProjectList openProjectStatus={showProjectStatus} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDashboardPage;
