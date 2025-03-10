import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { axiosInstance } from '@/config/axios'
import { toast } from 'sonner'
import { Eye, EyeClosed } from 'lucide-react'
import { SIGNUP_ROUTE } from '@/utils/constants'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [inputs, setInputs] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const navigate = useNavigate()

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const validateInputs = () => {
    let { firstName, email, password, confirmPassword } = inputs
    if (
      firstName.trim() === '' ||
      email.trim() === '' ||
      password.trim() === ''
    ) {
      toast.error('All Fields are required')
      return false
    }
    const emailRegEx = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ // Email validation regex

    if (!emailRegEx.test(email)) {
      toast.error('Invalid email address')
      return false
    }
    // const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    // if (!passwordRegex.test(password)){
    //     toast.error('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.')
    //     return false
    // }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return false
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
      await axiosInstance.post(SIGNUP_ROUTE, inputs)
      navigate('/login')
      toast.success('User registered successfully!')
    } catch (error) {
      // const { status, statusText, data } = error.response
      // console.error(`${status} - ${statusText} : ${data.message}`)
      toast.error(error.response.data.message)
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
              autoComplete="off"
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
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                id="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                autoComplete="off"
              />
              <div
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                id="confirmPassword"
                name="confirmPassword"
                value={inputs.confirmPassword}
                onChange={handleChange}
                autoComplete="off"
              />
              <div
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>
          <Button type="submit" className="mx-auto">
            Sign Up
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
