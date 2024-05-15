// 1. react
import { useEffect } from 'react';
// 2. library
// 3. api
// 4. store
import usePageInfoStore from '@/stores/pageInfoStore';
// 5. component
// 6. assets

const AdminPage = () => {
  const { setPageType } = usePageInfoStore();

  // 위치 정보 초기화
  useEffect(() => {
    setPageType('init');
  }, []);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='text-2xl font-normal'>관리자 페이지</div>
      <div>사원 관리 및 추가</div>
      <div>프로젝트 관리</div>
      <div>출력이력 관리</div>
      <div>공지 관리</div>
    </div>
  );
};

export default AdminPage;
