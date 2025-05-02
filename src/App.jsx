import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login/loginPage'
import FirstAccountPage from './pages/AccountSetupPage/AccountSetupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>hello world</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/firstaccount" element={<FirstAccountPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
