// 1. react 관련
import { useEffect } from 'react';
// 2. library
// 3. api
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. components
import ProjectList from '@/components/main/ProjectList';
import Calendar from '@/components/main/Calendar';
// 6. image 등 assets
const MainDashboardPage = () => {
  // page 컴포넌트 이므로, setPageType을 설정해준다
  const { setPageType } = usePageInfoStore();

  useEffect(() => {
    // 초기화 시켜준다. 이때, type은 init 이고, argument는 필요없다.
    setPageType('init');
  }, []);

  return (
    <>
      <div className='flex justify-center'>
        <p className='text-5xl font-bold'>프로젝트 대시보드 페이지</p>
      </div>
      {/* br보다 gap, margin, padding으로 마진 조정 */}
      <div className='flex items-center justify-center '>
        <div className='grid max-h-[900px] max-w-[1500px] grid-cols-2 gap-10 overflow-auto'>
          <div className='flex h-full w-full items-center justify-center overflow-auto bg-gradient-to-r from-blue-500 to-blue-300 text-black'>
            <Calendar />
          </div>

          <div className='flex h-full w-full items-center justify-center overflow-auto text-black'>
            <ProjectList />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDashboardPage;
