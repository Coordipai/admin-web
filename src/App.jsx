import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BuildProject } from './pages/build_project/BuildProject'
import { BuildProject2 } from './pages/build_project/BuildProject2' 
import { BuildProject3 } from './pages/build_project/BuildProject3'
import { Project } from './pages/project/Project'
import AddIssue from './pages/issue/AddIssue'

import ComponentTest from '@pages/ComponentTest'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>hello world</h1>} />
        <Route path='components' element={<ComponentTest />} />
        <Route path="/buildproject" element={<BuildProject/>}/>
        <Route path="/buildproject2" element={<BuildProject2/>}/>
        <Route path="/buildproject3" element={<BuildProject3/>}/>
        <Route path="/project" element={<Project/>}/>
        <Route path="/issue/add" element={<AddIssue/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
