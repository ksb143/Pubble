// 1. react 관련
// 2. library
// 3. api
// 4. store
// 5. components
import {
  ProjectList
} from "@/components/main/ProjectList";
import {
  Calendar
} from "@/components/main/Calendar";
// 6. image 등 assets
const MainDashboardPage = () => {
  return (
    <>
    
    <div className="flex justify-center">
    <p className="text-5xl font-bold">프로젝트 대시보드 페이지</p>
    </div>
    {/* br보다 gap, margin, padding으로 마진 조정 */}
    <div className="flex items-center justify-center ">
      <div className="grid grid-cols-2 gap-10 max-w-[1500px] max-h-[600px] overflow-hidden">

        <div className="bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center text-black overflow-hidden w-full h-full">
          <Calendar />
        </div>

        <div className="flex items-center justify-center text-black overflow-hidden w-full h-full">
          <ProjectList />
        </div>

      </div>
    </div>
    
    </>
  );
};

export default MainDashboardPage;
