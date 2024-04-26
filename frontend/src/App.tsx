import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './App.css';

function App() {
  const navigate = useNavigate();
  return (
    <Router>
      <Routes></Routes>
    </Router>
  );
}

export default App;
