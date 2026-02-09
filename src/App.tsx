import { Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import NotFound from './notfound/NotFound'
import Dashboard from './pages/dashboard/Dashboard'
import Test from './pages/tests/CreateTest'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tests/create" element={<Test />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
