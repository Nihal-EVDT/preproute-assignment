import { Routes, Route } from 'react-router-dom'
import Login from './login/Login'
import NotFound from './notfound/NotFound'
import Home from './home/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
