import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import {axiosInstance} from '../api/axios'
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import socket from '../socket';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { LOGIN_URL } from '@/utils/constants';
import { useAppStore } from '@/store';
import { toast } from 'sonner';

const Login = () => {

  const navigate = useNavigate();
  // const {auth, setAuth} = useContext(AuthContext);
  const {setUserInfo} =  useAppStore()
  const [inputs, setInputs] = useState({email : "", password : ""});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  // Todo: validation pending
  const validateLogin = () => {return true}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateLogin()) return;
    // return;
    try {
      const response = await axios.post(LOGIN_URL, inputs);
      // setAuth({user : inputs.email, pwd : inputs.password, token: response.data.token})
      // localStorage.setItem('auth', 1)
      // setAuth(response.data.user)
      setUserInfo(response.data.user)

      //Check: userId is not binded
      socket.userId = response.data.user._id
      socket.connect()
      navigate('/chat')
      toast.success('User Login successfully!')
    } catch (error) {
      console.error(error);
      toast.error(error.message)
      // alert(error.response.data.message);
    }
  }
  
  return (
    <div className='flex flex-col items-center justify-center h-screen drop-shadow-md'>
      <form onSubmit={handleSubmit}>
        <Input className='my-2' type="email" placeholder="Email" name='email' value={inputs.email} onChange={handleChange} />
        <Input className= 'my-2' type="password" placeholder="Password" name='password' value={inputs.password} onChange={handleChange} />
        <Button className = 'mx-auto' type="submit">Login</Button>
      </form>
      <p className='my-2'>Don't have an account?</p>
      <Button asChild variant="secondary">
        <Link to = '/signup'>Sign up</Link>
      </Button>
    </div>
  );
};

export default Login;
