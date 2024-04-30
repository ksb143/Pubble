import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from '@/routers/User';
import Requirement from '@/routers/Requirement';
import Main from '@/routers/ProjectDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path='/user/*' element={<User />} /> */}
        <Route path='/requirement/*' element={<Requirement />} />
        <Route path='/main/*' element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
