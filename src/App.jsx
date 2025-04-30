import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ComponentTest from '@pages/ComponentTest'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>hello world</h1>} />
        <Route path="components" element={<ComponentTest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
