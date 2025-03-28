import Input from '@/components/Input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { Mail } from 'lucide-react'
import { useState } from 'react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { forgotPassword } = useAppStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const response = await forgotPassword(email)
    setMessage(response?.message)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              icon={<Mail size={20} />}
              type="email"
              placeholder="Enter your email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border p-2"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full text-primary-content"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        {message && <p className="mt-4 text-gray-600">{message}</p>}
      </div>
    </div>
  )
}

export default ForgotPassword
