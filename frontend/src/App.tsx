// 1. react 관련
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 2. library
// 3. api
// 4. store
import useUserStore from '@/stores/userStore.ts';
// 5. component
import User from '@/routers/User';
import Project from '@/routers/Project';
import Admin from '@/routers/Admin';
import Layout from '@/components/layout/Layout';
import MainPage from '@/pages/main/MainPage';
// 6. image 등 assets

function App() {
  const {
    setName, // 이름 세팅
    setProfileColor, // 프로필 색상 세팅
    setEmployeeId, // 사원번호 세팅
    setDepartment, // 부서 세팅
    setPosition, // 직급 세팅
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
          {/* 관리자 페이지 */}
          <Route path='/admin/*' element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
