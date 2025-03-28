import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Todo: change - page
import SignUp from './components/Signup'
import Login from './components/Login'
import { AuthRoutes, PrivateRoutes } from './utils/protectedRoutes'
import { useAppStore } from './store'
import VerifyYourEmail from './pages/VerifyYourEmail'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  // Todo: fetch userInfo on Refresh/ Rerender
  const { checkAuth, theme } = useAppStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // if (isCheckingAuth) return <p>loading...</p>
  return (
    <>
      <div data-theme={theme}>
        <Router>
          <Routes>
            <Route element={<AuthRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-email" element={<VerifyYourEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/chat" element={<Chat />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
