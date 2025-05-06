import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BuildProject } from '@pages/build_project/BuildProject'
import { BuildProject2 } from '@pages/build_project/BuildProject2' 
import { BuildProject3 } from '@pages/build_project/BuildProject3'
import { Project } from '@pages/project/Project'
import IssueDetailPage from '@pages/issue/IssueDetailPage'
import { Home } from './pages/Home'
import ComponentTest from '@pages/ComponentTest'
import { SettingProject } from './pages/build_project/SettingProject'
import { ToastContainer } from 'react-toastify'

function App () {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='components' element={<ComponentTest />} />
        <Route path="/buildproject" element={<BuildProject/>}/>
        <Route path="/buildproject2" element={<BuildProject2/>}/>
        <Route path="/buildproject3" element={<BuildProject3/>}/>
        <Route path="/project" element={<Project/>}/>
        <Route path="/issue" element={<IssueDetailPage/>}/>
        <Route path="/settingproject" element={<SettingProject/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
