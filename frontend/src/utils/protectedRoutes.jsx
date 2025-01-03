import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store'

const AuthRoutes = () => {
  const { userInfo } = useAppStore()
  const location = useLocation()
  if (userInfo)
    return <Navigate to="/chat" state={{ from: location.pathname }} replace />
  return <Outlet />
}

const PrivateRoutes = () => {
  const { userInfo } = useAppStore()
  // console.log(userInfo)
  const location = useLocation()
  if (userInfo) return <Outlet />
  return <Navigate to="/" state={{ from: location.pathname }} replace />
}

export { AuthRoutes, PrivateRoutes }
