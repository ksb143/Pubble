import { Routes, Route } from 'react-router-dom';

import DashboardPage from '@/pages/project_dashboard/DashboardPage';
const Main = () => {
  return (
    <Routes>
      <Route path='/' element={<DashboardPage />} />
    </Routes>
  );
};

export default Main;
