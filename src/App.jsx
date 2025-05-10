import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'

import brandIcon from '@assets/CoordiPAILogo.png'
import { PageBox } from '@styles/globalStyle'
import SideBar from '@components/SideBar'

import LoginPage from './pages/login/LoginPage'
import FirstAccountPage from './pages/AccountSetupPage/AccountSetupPage'
import IssueModalTest from './pages/issue/IssueModalTest'
import UserForm from './pages/UserPage/UserPage'
import IssueRequestPage from './pages/issue/IssueRequestPage'
import RepositoryCheckPage from './pages/AccountSetupPage/RepositoryCheckPage'
import { BuildProject } from './pages/build_project/BuildProject'
import { BuildProject2 } from './pages/build_project/BuildProject2' 
import { BuildProject3 } from './pages/build_project/BuildProject3'
import { Project } from './pages/project/Project'
import { Home } from './pages/Home'
import ComponentTest from '@pages/ComponentTest'
import { SettingProject } from './pages/build_project/SettingProject'
import IssueDetailPage from './pages/issue/IssueDetailPage'


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
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/firstaccount" element={<FirstAccountPage />} />
        
        <Route path="/repositorycheckpage" element={<RepositoryCheckPage />} />
        
        {/* Sidebar */}
        <Route path="/user" element={<UserForm />} />

        {/* Test Page */}
        <Route path='/components' element={<PrivateRoute element={ComponentTest} />} />
        <Route path="/issueModalTest" element={<IssueModalTest />} />

        {/* BuildProject Page*/}
        <Route path='/buildproject' element={<PrivateRoute element={BuildProject} />} />
        <Route path='/buildproject2' element={<PrivateRoute element={BuildProject2} />} />
        <Route path='/buildproject3' element={<PrivateRoute element={BuildProject3} />} />
        
        {/* Project Page */}
        <Route path="/project/:projectId" element={<PrivateRoute element={Project} />} />
        <Route path="/project/:projectId/issue/:issueId" element={<PrivateRoute element={IssueDetailPage} />} />
        <Route path='/project/:projectId/edit' element={<PrivateRoute element={SettingProject} />} />
        <Route path='/project/:projectId/request/:requestId' element={<PrivateRoute element={IssueRequestPage} />} />
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

  // dummy data
  const project = {
    projectName: 'MockProjectX',
    iteration: {
      week: '3',
      period: '2025-05-01 ~ 2025-05-07'
    },
    issues: 42,
    categories: [
      {
        categoryName: 'Frontend',
        people: [
          {
            image: brandIcon,
            userName: 'Alice',
            githubId: 'alice-dev'
          },
          {
            image: brandIcon,
            userName: 'Bob',
            githubId: 'bob-dev'
          }
        ]
      },
      {
        categoryName: 'Backend',
        people: [
          {
            image: brandIcon,
            userName: 'Charlie',
            githubId: 'charlie-dev'
          }
        ]
      }
    ]
  }
  const userInfo = {
    image: brandIcon,
    userName: 'TestUser',
    githubId: 'testuser123'
  }

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
          titleOnClick={() => navigate(`/`)}
          project={project}
          userInfo={userInfo}
          userOnClick={() => navigate(`/user`)}
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
