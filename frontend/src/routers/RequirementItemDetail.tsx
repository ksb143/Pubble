import { Routes, Route } from 'react-router-dom';

import RequirementItemDetailPage from '@/pages/detail/RequirementItemDetailPage.tsx';

const RequirementItemDetail = () => {
  return (
    <Routes>
      <Route
        path='/:projectName/:requirementId/detail'
        element={<RequirementItemDetailPage />}
      />
    </Routes>
  );
};

export default RequirementItemDetail;
