import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login/loginPage'
import FirstAccountPage from './pages/AccountSetupPage/AccountSetupPage'
import IssueModalTest from './pages/IssuePage/IssueModalTest'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>hello world</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/firstaccount" element={<FirstAccountPage />} />
        <Route path="/issueModalTest" element={<IssueModalTest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
