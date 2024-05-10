import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from '@/routers/User';
import Project from '@/routers/Project';
import Layout from '@/components/layout/Layout';
import MainPage from '@/pages/main/MainPage';
import useUserStore from '@/stores/userStore.ts';

function App() {
  const {
    setName,
    setProfileColor,
    setEmployeeId,
    setDepartment,
    setPosition,
  } = useUserStore();

  useEffect(() => {
    // 로그인 정보 가져오기
    const token = localStorage.getItem('accessToken');
    if (token) {
      const { name, employeeId, department, position, profileColor } =
        parseJwt(token);
      setName(name);
      setEmployeeId(employeeId);
      setDepartment(department);
      setPosition(position);
      setProfileColor(profileColor);
    }
  }, []);

  // jwt 디코드 함수
  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  };

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
