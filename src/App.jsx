import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BuildProject } from './pages/build_project/BuildProject'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>hello world</h1>} />
        <Route path="/buildproject" element={<BuildProject/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
