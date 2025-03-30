import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { useAppStore } from '@/store'
import { toast } from 'sonner'
import Input from './Input'
import { AudioWaveform, Eye, EyeClosed, KeyRound, Mail } from 'lucide-react'
import { isEmailValid, isPasswordValid } from '@/utils/validatiors'

const Login = () => {
  const { login, authLoading } = useAppStore()
  const [showPassword, setShowPassword] = useState(false)
  const [inputs, setInputs] = useState({ email: '', password: '' })

  const navigate = useNavigate()
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const validateLogin = () => {
    let { email, password } = inputs
    if (email.trim() === '' || password.trim() === '') {
      toast.error('All Fields are required')
      return false
    }
    return isEmailValid(email) && isPasswordValid(password)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return
    login(inputs, navigate)
  }
  if (authLoading)
    return (
      <div className="h-screen w-screen animate-pulse items-center text-xl font-semibold text-gray-700">
        Logging In...
      </div>
    )
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-base-200/50 p-8 shadow-lg">
        <div className="mb-3 flex items-center justify-start gap-2 border-b-2 border-neutral pb-3 text-primary">
          <div className="rounded-full p-1 ring-1 ring-inset ring-primary">
            <AudioWaveform size={20} />
          </div>
          <h1 className="text-2xl font-bold">GupShup</h1>
        </div>
        <h2 className="mb-6 text-center text-lg font-bold">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Email Address"
            icon={<Mail size={20} />}
            type="text"
            id="email"
            placeholder="Enter your email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
          />
          {/* label put outside to show password relative postion */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                icon={<KeyRound size={20} />}
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
              />
              <div
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-primary" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </div>
            </div>
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
