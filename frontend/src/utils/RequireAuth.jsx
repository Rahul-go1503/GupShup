import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuth = () => {
    const {auth} = useAuth();
    // const auth = localStorage.getItem('auth')
    // const 
    const location = useLocation()
  return auth? <Outlet /> : <Navigate to = '/' state={{from: location.pathname}} replace/>
}

export default RequireAuth