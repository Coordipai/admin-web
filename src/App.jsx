import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BuildProject } from './pages/build_project/BuildProject'
import { BuildProject2 } from './pages/build_project/BuildProject2'
import { BuildProject3 } from './pages/build_project/BuildProject3'
import { Project } from './pages/project/Project'
import { Home } from './pages/Home'
import ComponentTest from '@pages/ComponentTest'
import { SettingProject } from './pages/build_project/SettingProject'
import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'

import brandIcon from '@assets/brandIcon.png'

import { PageBox } from '@styles/globalStyle'
import SideBar from '@components/SideBar'
import { useEffect } from 'react'
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
        <Route path='/components' element={<PrivateRoute element={ComponentTest} />} />
        <Route path='/buildproject' element={<PrivateRoute element={BuildProject} />} />
        <Route path='/buildproject2' element={<PrivateRoute element={BuildProject2} />} />
        <Route path='/buildproject3' element={<PrivateRoute element={BuildProject3} />} />
        <Route path='/project' element={<PrivateRoute element={Project} />} />
        <Route path='/settingproject' element={<PrivateRoute element={SettingProject} />} />
        <Route path='/issue' element={<PrivateRoute element={IssueDetailPage} />} />
      </Routes>
    </BrowserRouter>
  )
}

const PrivateRoute = ({ element: Component, hasSideBar = true }) => {
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

  const userOnClick = () => {
    // Handle user click event
    console.log('User clicked!')
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
          project={project}
          userInfo={userInfo}
          userOnClick={userOnClick}
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
