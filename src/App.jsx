import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'

import brandIcon from '@assets/CoordiPAILogo.png'
import { PageBox } from '@styles/globalStyle'
import SideBar from '@components/SideBar'

import { Home } from '@pages/Home'
import LoginPage from '@pages/login/LoginPage'
import FirstAccountPage from '@pages/AccountSetupPage/AccountSetupPage'
import RepositoryCheckPage from '@pages/AccountSetupPage/RepositoryCheckPage'
import UserForm from '@pages/UserPage/UserPage'
import ComponentTest from '@pages/ComponentTest'
import IssueModalTest from '@pages/issue/IssueModalTest'
import { BuildProject } from '@pages/build_project/BuildProject'
import { BuildProject2 } from '@pages/build_project/BuildProject2'
import { BuildProject3 } from '@pages/build_project/BuildProject3'
import { Project } from '@pages/project/Project'
import IssueDetailPage from '@pages/issue/IssueDetailPage'
import { SettingProject } from '@pages/build_project/SettingProject'
import IssueRequestPage from '@pages/issue/IssueRequestPage'
import NotFoundPage from '@pages/NotFoundPage'

/*
  route 설정 시, PrivateRoute를 사용하여,
  <Route
    path='project'
    element={<PrivateRoute element={Project} />}
  />
  형태로 사용하면 되고, sidebar가 없는 페이지의 경우
  hasSideBar={false}로 설정
*/
function App () {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<PrivateRoute element={Home} />} />

        <Route path='/login' element={<LoginPage />} />
        <Route path='/firstaccount' element={<FirstAccountPage />} />
        <Route path="/register/:githubId" element={<FirstAccountPage />} />

        <Route path='/repositorycheckpage' element={<RepositoryCheckPage />} />

        {/* Sidebar */}
        <Route path='/user' element={<UserForm />} />

        {/* Test Page */}
        <Route path='/components' element={<PrivateRoute element={ComponentTest} />} />
        <Route path='/issueModalTest' element={<IssueModalTest />} />

        {/* BuildProject Page */}
        <Route path='/buildproject' element={<PrivateRoute element={BuildProject} />} />
        <Route path='/buildproject2' element={<PrivateRoute element={BuildProject2} />} />
        <Route path='/buildproject3' element={<PrivateRoute element={BuildProject3} />} />

        {/* Project Page */}
        <Route path='/project/:projectId' element={<PrivateRoute element={Project} />} />
        <Route path='/project/:projectId/issue/:issueId' element={<PrivateRoute element={IssueDetailPage} />} />
        <Route path='/project/:projectId/edit' element={<PrivateRoute element={SettingProject} />} />
        <Route path='/project/:projectId/request/:requestId' element={<PrivateRoute element={IssueRequestPage} />} />

        {/* Not Found Page */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

const PrivateRoute = ({ element: Component, hasSideBar = true }) => {
  const navigate = useNavigate()
  // const location = useLocation();
  // const { authData, isAuthorized, logout, fetchAuthData } = useAuth();
  // const { navMenus, navSubMenus, footerNavMenus } = useNav();

  // useEffect(() => {
  //   fetchAuthData(location.pathname);
  // }, [fetchAuthData, location.pathname]);

  // if (!isAuthorized) {
  //   return <Navigate to='/login' />;
  // }

  const logout = () => {
    // Handle logout event
    console.log('Logout clicked!')
  }

  return hasSideBar ? (
    <PageBox>
      {
        // authData &&
        hasSideBar && (
          <SideBar
            brandIcon={brandIcon}
            brandTitle='CoordiPai'
            titleOnClick={() => navigate('/')}
            userOnClick={() => navigate('/user')}
            logout={logout}
          />
        )
      }
      <Component />
    </PageBox>
  ) : (
    <Component />
  )
}

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
  hasSideBar: PropTypes.bool
}

export default App
