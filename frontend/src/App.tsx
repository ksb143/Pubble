import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import User from '@/routers/User';
import Requirement from '@/routers/Requirement';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path='/user/*' element={<User />} /> */}
        <Route path='/requirement/*' element={<Requirement />} />
      </Routes>
    </Router>
  );
}

export default App;
