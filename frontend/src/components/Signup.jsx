import React, { useEffect, useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { SIGNUP_URL } from '@/utils/constants';
import { axiosInstance } from '@/config/axios';

const SignUp = () => {
  const [inputs, setInputs] = useState({firstName : "", email : "", password : ""})
  const [error, setError] = useState('')

  const navigate = useNavigate();
  const {toast} = useToast();

  useEffect(()=>{
    if(error){
      toast({
        variant: "destructive",
        description: error
      })
    }
  },[error])

  const handleChange = (event) => {
    setError('')
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }
  
  const validateInputs = ()=> {
    let {firstName, email, password} = inputs
    if(firstName === '' || email === '' || password === ''){
      setError('All Fields are required')
      return false
    }
    firstName = firstName.trim()
    email = email.trim()
    password = password.trim()
    if(firstName === ''){
      setError('Fields Can not be left blank')
      return false
    }
    const emailRegEx = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/; // Email validation regex

    if (!emailRegEx.test(email)) {
      setError('Invalid email address')
      return false
    }
    // const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    // if (!passwordRegex.test(password)){
    //     setError('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.')
    //     return false
    // }
    return true
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateInputs()){
      return
    }
    try {
      const response = await axiosInstance.post(SIGNUP_URL, inputs);
      navigate('/login')
      // alert('User registered successfully!');
      toast({
        variant: "destructive",
        description: 'User registered successfully!'
      });
    } catch (error) {
      const {status, statusText, data} = error.response
      console.error(`${status} - ${statusText} : ${data.message}`);
      // alert(error.response.data.message);
      toast({
        variant: "destructive",
        description: data.message
      });
    }
  };

  // Todo: show and hide password and more validation
  return (
    <div className='flex flex-col items-center justify-center h-screen drop-shadow-md'>
      <form onSubmit={handleSubmit}>
        <Input className = 'my-2' type="text" placeholder="Name" name='firstName' value={inputs.firstName} onChange={handleChange}/>
        <Input className = 'my-2' type="text" placeholder="Email" name='email' value={inputs.email} onChange={handleChange}/>
        <Input className = 'my-2' type="password" placeholder="Password" name='password' value={inputs.password} onChange={handleChange} />
        <Button type="submit">Sign Up</Button>
      </form>
      <p>Already have an account?</p>
      <Button asChild variant="secondary">
        <Link to = '/login'>Login</Link>
      </Button>
    </div>
  );
};

export default SignUp;
