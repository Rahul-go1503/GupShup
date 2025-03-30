import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { toast } from 'sonner'
import {
  AudioWaveform,
  Eye,
  EyeClosed,
  KeyRound,
  Mail,
  User,
} from 'lucide-react'
import { useAppStore } from '@/store'
import Input from './Input'
import { isEmailValid, isPasswordValid } from '@/utils/validatiors'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [inputs, setInputs] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { signup, authLoading } = useAppStore()

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
    if (!isEmailValid(email) || !isPasswordValid(password)) return false
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
    signup(inputs, navigate)
  }

  // Todo: validation
  if (authLoading)
    return (
      <div className="h-screen w-screen animate-pulse items-center text-xl font-semibold text-gray-700">
        signing up...
      </div>
    )
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8 shadow-lg">
        <div className="mb-3 flex items-center justify-start gap-2 border-b-2 border-neutral pb-3 text-primary">
          <div className="rounded-full p-1 ring-1 ring-inset ring-primary">
            <AudioWaveform size={20} />
          </div>
          <h1 className="text-2xl font-bold">GupShup</h1>
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Full Name"
            icon={<User size={20} />}
            type="text"
            placeholder="Enter your name"
            id="firstName"
            name="firstName"
            value={inputs.firstName}
            onChange={handleChange}
            autoComplete="off"
          />
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <Input
              icon={<Mail size={20} />}
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
                icon={<KeyRound size={20} />}
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
                  <Eye className="h-5 w-5 text-primary" />
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
                icon={<KeyRound size={20} />}
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
                  <Eye className="h-5 w-5 text-primary" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full text-primary-content">
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
