import { useEffect } from 'react';
import usePageInfoStore from '@/stores/pageInfoStore';

const AdminPage = () => {
  const { setPageType } = usePageInfoStore();

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
