import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { SIGNUP_URL } from '@/utils/constants'
import { axiosInstance } from '@/config/axios'
import { toast } from 'sonner'

const SignUp = () => {
  const [inputs, setInputs] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleChange = (event) => {
    setError('')
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const validateInputs = () => {
    let { firstName, email, password, confirmPassword } = inputs
    if (firstName === '' || email === '' || password === '') {
      setError('All Fields are required')
      return false
    }
    firstName = firstName.trim()
    email = email.trim()
    password = password.trim()
    if (firstName === '') {
      setError('Fields Can not be left blank')
      return false
    }
    const emailRegEx = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ // Email validation regex

    if (!emailRegEx.test(email)) {
      setError('Invalid email address')
      return false
    }
    // const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    // if (!passwordRegex.test(password)){
    //     setError('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.')
    //     return false
    // }
    if (password !== confirmPassword) {
      setError("Password didn't match")
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateInputs()) {
      return
    }
    try {
      // Check: with crediential
      const response = await axiosInstance.post(SIGNUP_URL, inputs)
      navigate('/login')
      toast.success('User registered successfully!')
    } catch (error) {
      const { status, statusText, data } = error.response
      console.error(`${status} - ${statusText} : ${data.message}`)
      toast.error(data.message)
    }
  }

  // Todo: show and hide password and more validation
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Enter your name"
              id="firstName"
              name="firstName"
              value={inputs.firstName}
              onChange={handleChange}
              autocomplete="off"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <Input
              type="text"
              placeholder="Enter your email"
              id="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              autocomplete="off"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              type="password"
              placeholder="Create a password"
              id="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              autocomplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Password
            </label>
            <Input
              type="password"
              placeholder="Re-enter your password"
              id="confirmPassword"
              name="confirmPassword"
              value={inputs.password}
              onChange={handleChange}
              autocomplete="off"
            />
          </div>
          <Button type="submit" className="w-full text-white">
            Sign Up
          </Button>
        </form>
        <p className="mt-8">Already have an account?</p>
        <Button asChild className="w-1/2 bg-accent text-white">
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}

export default SignUp
