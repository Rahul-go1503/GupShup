import Input from '@/components/Input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { Eye, EyeClosed, Shield, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [newConfirmPassword, setNewConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { resetPassword } = useAppStore()

  const validateInputs = () => {
    if (!isPasswordValid(newPassword)) return false
    if (newPassword !== newConfirmPassword) {
      toast.error("Passwords don't match")
      return false
    }
    return true
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return setMessage('Invalid or expired token.')
    validateInputs()
    const response = await resetPassword(token, newPassword)
    setMessage(response.message)

    if (response.message === 'Password reset successful') {
      setMessage('Password reset successful. Redirecting to login page...')
      setTimeout(() => navigate('/login'), 3000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1">
              <Input
                icon={<Shield size={20} />}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                id="password"
                name="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                icon={<ShieldCheck size={20} />}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                id="confirmPassword"
                name="confirmPassword"
                value={newConfirmPassword}
                onChange={(e) => setNewConfirmPassword(e.target.value)}
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
            Reset Password
          </Button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  )
}

export default ResetPassword
