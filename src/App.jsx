import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login/loginPage'
import FirstAccountPage from './pages/AccountSetupPage/AccountSetupPage'
import IssueModalTest from './pages/IssuePage/IssueModalTest'
import UserForm from './pages/UserPage/UserPage'
import ChangeRequestPage from './pages/IssuePage/changeIssuePage'
import RepositoryCheckPage from './pages/AccountSetupPage/RepositoryCheckPage'
import { BuildProject } from './pages/build_project/BuildProject'
import { BuildProject2 } from './pages/build_project/BuildProject2' 
import { BuildProject3 } from './pages/build_project/BuildProject3'
import { Project } from './pages/project/Project'
import { Home } from './pages/Home'
import ComponentTest from '@pages/ComponentTest'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>hello world</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/firstaccount" element={<FirstAccountPage />} />
        <Route path="/issueModalTest" element={<IssueModalTest />} />
        <Route path="/userform" element={<UserForm />} />
        <Route path="/repositorycheckpage" element={<RepositoryCheckPage />} />
        <Route path="/changeIssuePage" element={<ChangeRequestPage />} />
        <Route path='/' element={<Home />} />
        <Route path='components' element={<ComponentTest />} />
        <Route path="/buildproject" element={<BuildProject/>}/>
        <Route path="/buildproject2" element={<BuildProject2/>}/>
        <Route path="/buildproject3" element={<BuildProject3/>}/>
        <Route path="/project" element={<Project/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
