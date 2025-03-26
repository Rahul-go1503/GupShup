import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { useAppStore } from '@/store'
import { toast } from 'sonner'
import Input from './Input'
import { KeyRound, Mail } from 'lucide-react'

const Login = () => {
  const { login } = useAppStore()
  const [inputs, setInputs] = useState({ email: '', password: '' })

  const navigate = useNavigate()
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  // Todo: validation pending
  const validateLogin = () => {
    let { email, password } = inputs
    if (email.trim() === '' || password.trim() === '') {
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
    //     toast.error('Password should be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.')
    //     return false
    // }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return
    login(inputs, navigate)
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-base-200/50 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <Input
              icon={<Mail size={20} />}
              type="text"
              id="email"
              placeholder="Enter your email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              icon={<KeyRound size={20} />}
              type="password"
              id="password"
              placeholder="Enter your password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between text-sm">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button className="w-full text-primary-content" type="submit">
            Login
          </Button>
        </form>

        {/* <div className="mt-6 flex items-center justify-center space-x-4">
          <Button
            className="flex w-full items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700"
            onClick={() => handleSocialLogin('google')}
          >
            Login with Google
          </Button>
          <Button
            className="flex w-full items-center justify-center gap-2 bg-gray-800 text-white hover:bg-gray-900"
            onClick={() => handleSocialLogin('github')}
          >
            Login with GitHub
          </Button>
        </div> */}

        <p className="mt-6 text-center text-sm">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
