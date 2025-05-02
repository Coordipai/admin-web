import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BuildProject } from './pages/build_project/BuildProject'
import {BuildProject2} from './pages/build_project/BuildProject2' 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>hello world</h1>} />
        <Route path="/buildproject" element={<BuildProject/>}/>
        <Route path="/buildproject2" element={<BuildProject2/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
