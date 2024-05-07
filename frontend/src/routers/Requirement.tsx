import { Routes, Route } from 'react-router-dom';

import RQPage from '@/pages/requirement/RQPage.tsx';
import RQDetail from '@/pages/requirement/RQDetail.tsx';

const Requirement = () => {
  return (
    <Routes>
      <Route path='/' element={<RQPage />} /> {/* 1개 프로젝트의 요구사항 항목 리스트 페이지 */}
      <Route path=':id' element={<RQDetail />} /> {/* 요구사항 항목의 상세 페이지 */}
    </Routes>
  );
};

export default Requirement;
