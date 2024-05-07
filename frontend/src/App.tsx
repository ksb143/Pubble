import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from '@/routers/User';
import Requirement from '@/routers/Requirement';
import Main from '@/routers/Main';
import Layout from '@/components/layouts/Layout';
import TestPage from '@/pages/TestPage';
import RequirementItemDetail from '@/routers/RequirementItemDetail.tsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* 상단바 없는 페이지 */}
        <Route path='/' element={<User />} />
        <Route path='/requirement/*' element={<Requirement />} />
        <Route path='/main/*' element={<Main />} />
        {/* 상단바 있는 페이지 */}
        <Route element={<Layout />}>
          <Route path='/test' element={<TestPage />} />
          <Route path='/requirement/*' element={<RequirementItemDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
