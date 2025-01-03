import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useAppStore } from '@/store'
import { toast } from 'sonner'

const Login = () => {
  const { login } = useAppStore()
  const [inputs, setInputs] = useState({ email: '', password: '' })

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
    login(inputs)
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
              type="text"
              id="email"
              placeholder="Enter your email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              // autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              // autoComplete="off"
            />
          </div>
          <Button className="mx-auto" type="submit">
            Login
          </Button>
        </form>

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
