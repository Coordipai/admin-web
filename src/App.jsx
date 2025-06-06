import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
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
import BuildProject from '@pages/build_project/BuildProject'
import { Project } from '@pages/project/Project'
import IssueDetailPage from '@pages/issue/IssueDetailPage'
import { SettingProject } from '@pages/build_project/SettingProject'
import IssueRequestPage from '@pages/issue/IssueRequestPage'
import NotFoundPage from '@pages/NotFoundPage'
import IssueSuggestPage from '@pages/issue/IssueSuggestPage'

// import ProjectTest from '@pages/test/ProjectTest'
// import ComponentTest from '@pages/test/ComponentTest'
// import IssueModalTest from '@pages/issue/IssueModalTest'

import useLoadingStore from '@store/useLoadingStore'
import { useUserStore, useAccessTokenStore, useRefreshTokenStore } from '@store/useUserStore'
import { Loading } from '@components/Loading'
import { useProjectStore } from './store/useProjectStore'

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
    <>
      <GlobalLoading />
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<PrivateRoute element={<Home />} />} />

          <Route path='/login' element={<LoginPage />} />
          <Route path='/register/:githubId' element={<FirstAccountPage />} />
          <Route path='/repositorycheckpage/:githubId' element={<RepositoryCheckPage />} />
          <Route path='/userform/:githubId' element={<PrivateRoute element={<UserForm />} />} />

          <Route path='/repositorycheckpage' element={<RepositoryCheckPage />} />

          {/* Sidebar */}
          <Route path='/user' element={<PrivateRoute element={<UserForm />} />} />

          {/* Test Page */}
          {/* <Route path='/components' element={<PrivateRoute element={<ComponentTest />} />} />
          <Route path='/issueModalTest' element={<PrivateRoute element={<IssueModalTest />} />} />
          <Route path='/projectTest' element={<PrivateRoute element={<ProjectTest/>} />} /> */}

          {/* BuildProject Page */}
          <Route path='/buildproject' element={<PrivateRoute element={<BuildProject />} />} />
          {/* Project Page */}

          <Route path='/project/:projectId' element={<PrivateRoute element={<Project />} />} />
          <Route path='/project/:projectId/issue/:issueNumber' element={<PrivateRoute element={<IssueDetailPage />} />} />
          <Route path='/project/:projectId/issuesuggest' element={<PrivateRoute element={<IssueSuggestPage />} />} />
          <Route path='/project/:projectId/edit' element={<PrivateRoute element={<SettingProject />} />} />
          <Route path='/project/:projectId/request/:requestId' element={<PrivateRoute element={<IssueRequestPage />} />} />

          {/* Not Found Page */}
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

const PrivateRoute = ({ element, hasSideBar = true }) => {
  const navigate = useNavigate()

  const userOnClick = () => {
    navigate('/user')
    useProjectStore.getState().clearProject()
  }

  const logout = () => {
    useUserStore.getState().clearUser()
    useAccessTokenStore.getState().clearAccessToken()
    useRefreshTokenStore.getState().clearRefreshToken()
    navigate('/login')
  }

  return hasSideBar
    ? (
      <PageBox>
        {
        hasSideBar && (
          <SideBar
            brandIcon={brandIcon}
            brandTitle='CoordiPai'
            titleOnClick={() => navigate('/')}
            userOnClick={userOnClick}
            logout={logout}
          />
        )
      }
        {element}
      </PageBox>
      )
    : (
        { element }
      )
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  hasSideBar: PropTypes.bool
}

const GlobalLoading = () => {
  const { isLoading } = useLoadingStore()
  return <Loading isLoading={isLoading} />
}

export default App
