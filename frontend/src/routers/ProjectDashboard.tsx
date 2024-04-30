import { Routes, Route } from 'react-router-dom';

import DashboardPage from '@/pages/project_dashboard/projectDashboardPage';

const ProjectDashboard = () => {
  return (
    <Routes>
      <Route path='/' element={<DashboardPage />} />
    </Routes>
  );
};

export default ProjectDashboard;
