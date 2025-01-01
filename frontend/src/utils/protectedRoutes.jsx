import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store'

const AuthRoutes = () => {
    const {userInfo} = useAppStore()
    const location = useLocation()
  return userInfo? <Navigate to = '/chat' state={{from: location.pathname}} replace/> : <Outlet />
}

const PrivateRoutes = () => {
  const {userInfo} = useAppStore()
  const location = useLocation()
return userInfo? <Outlet /> : <Navigate to = '/' state={{from: location.pathname}} replace/>
}

export {AuthRoutes, PrivateRoutes}