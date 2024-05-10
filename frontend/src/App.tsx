import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from '@/routers/User';
import Project from '@/routers/Project';
import Layout from '@/components/layout/Layout';
import MainPage from '@/pages/main/MainPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 상단바 없는 페이지 */}
        <Route path='/' element={<User />} />

        {/* 상단바 있는 페이지 */}
        <Route element={<Layout />}>
          {/* 메인 대시보드 페이지 */}
          <Route path='/main' element={<MainPage />} />
          {/* 프로젝트 페이지들*/}
          <Route path='/project/*' element={<Project />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
