import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'

// Todo: change - page
import SignUp from './components/Signup'
import Login from './components/Login'
import { AuthRoutes, PrivateRoutes } from './utils/protectedRoutes'
import { useAppStore } from './store'

function App() {
  // Todo: fetch userInfo on Refresh/ Rerender
  const { isCheckingAuth, checkAuth } = useAppStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <p>loading...</p>
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AuthRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
