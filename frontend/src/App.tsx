import React from 'react';
import { Routes, Route, useNavigate} from 'react-router-dom';
import Test from '@/pages/test'
import reactLogo from './assets/react.svg'
import './App.css'

function App() { 
  const navigate = useNavigate();
  const goToTestPage = () => {
    navigate('/test');
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <button onClick={goToTestPage}>절대경로</button>
      <Routes>
        <Route path='/test' element={<Test/>}/>
      </Routes>
    </>
  );
}

export default App;
