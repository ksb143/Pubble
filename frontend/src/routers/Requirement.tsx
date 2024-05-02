import { Routes, Route } from 'react-router-dom';

import RQPage from '@/pages/requirement/RQPage.tsx';

const Requirement = () => {
  return (
    <Routes>
      <Route path='/' element={<RQPage />} />
    </Routes>
  );
};

export default Requirement;
