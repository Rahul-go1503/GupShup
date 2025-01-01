import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

// Todo: change - page
import SignUp from './components/Signup';
import Login from './components/Login';
import { AuthRoutes, PrivateRoutes } from './utils/protectedRoutes';
import { useAppStore } from './store';
import { toast } from 'sonner';
import { axiosInstance } from './config/axios';
import { USER_INFO_ROUTE } from './utils/constants';
import Chat2 from './pages/Chat2';

function App() {

  const [loading, setLoading] = useState(false)

  // Todo: fetch userInfo on Refresh/ Rerender
  // const {userInfo, setUserInfo} = useAppStore.getState()
  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     try{
  //       const response = await axiosInstance.get(USER_INFO_ROUTE)
  //       setUserInfo(response.data.user)
  //     }
  //     catch(err){
  //       toast.error(err.message)
  //     }
  //     finally{
  //       setLoading(false)
  //     }
  //   }

  //   if(!userInfo){
  //     getUserInfo()
  //   }
  //   else{
  //     setLoading(false)
  //   }
  // }, [userInfo])
  return (
    loading ? <p>loading....</p> : 
    <Router>
      <Routes>
      <Route path = '/chat2' element = {<Chat2/>}/>
        <Route path="/" element={<Home />} />
        <Route element= {<AuthRoutes/>}>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element= {<PrivateRoutes/>}>
          <Route path = '/chat' element = {<Chat/>}/>
        </Route> 
      </Routes>
    </Router>
  );
}

export default App;
