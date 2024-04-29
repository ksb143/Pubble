import { Routes, Route } from 'react-router-dom';

// import LoginPage from '@/pages/user/LoginPage.tsx';
import RequirementPage from '@/pages/requirement/requirementPage.tsx';

const Requirement = () => {
  return (
    <Routes>
      <Route path='/' element={<RequirementPage />} />
    </Routes>
  );
};

export default Requirement;
