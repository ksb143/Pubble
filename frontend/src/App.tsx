import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import User from '@/routers/User';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/user/*' element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
