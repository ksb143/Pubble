import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from '@/routers/User';
import Layout from '@/components/layouts/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* 상단바 없는 페이지 */}
        <Route path='/user/*' element={<User />} />
        {/* 상단바 있는 페이지 */}
        <Route element={<Layout />}>
          <Route path='/' />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
