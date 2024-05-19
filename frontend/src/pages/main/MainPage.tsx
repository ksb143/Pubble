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

interface Participant {
  name: string;
  profileColor: string;
  position: string;
}

interface ProjectStatus {
  approveRatio?: number;
  lockRatio?: number;
  changedRatio?: number;
  participants?: Participant[];
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
    console.log(projectData.data.approveRatio);
    console.log(projectData.data.changedRatio);
    setProjectStatus({
      lockRatio: Math.round(projectData.data.lockRatio * 100),
      approveRatio: Math.round(projectData.data.approveRatio * 100),
      changedRatio: Math.round(projectData.data.changedRatio * 100),
      participants: projectData.data.people.map(
        (person: { name: string; position: string; profileColor: string }) => ({
          name: person.name,
          position: person.position,
          profileColor: person.profileColor,
        }),
      ),
    });
    setIsProjectStatusSheet(true);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-10 transition duration-700 ${isProjectStatusSheet ? 'bg-gray-900/30 backdrop-blur-none' : 'pointer-events-none -z-10'}`}
        onClick={() => setIsProjectStatusSheet(false)}></div>
      <ProjectStatusSheet
        isOpen={isProjectStatusSheet}
        closeSheet={() => setIsProjectStatusSheet(false)}
        projectStatus={projectStatus}
      />
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
