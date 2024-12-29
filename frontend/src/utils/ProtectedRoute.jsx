
import React from 'react'
import { useUserContext } from './ContextProvider'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const {user} = useUserContext()
  return (
    true ? children : <Navigate to = '/'/>
  )
}

export default ProtectedRoute