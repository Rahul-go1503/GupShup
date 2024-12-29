import React, { createContext, useContext, useState} from 'react'

const userContext = createContext({name : "John Doe", LoggedIn : false})

const ContextProvider = ({children}) => {
    const [user, setUser]  = useState({name : "John Doe", LoggedIn : false})
  return (
    <userContext.Provider value = {{user, setUser}}>
        {children}
    </userContext.Provider>
  )
}
export const useUserContext = () => {useContext(userContext)}
export default ContextProvider