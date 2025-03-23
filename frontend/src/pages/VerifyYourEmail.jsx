import { useAppStore } from '@/store'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const VerifyYourEmail = () => {
  const { email, verifyEmail, resendVerificationLink } = useAppStore()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      const verify = async () => {
        const response = await verifyEmail(token, navigate)
        // console.log(response)
        setMessage(response)
      }

      verify()
    } else if (!email) {
      navigate('/')
    } else {
      setMessage(`A verification link has been sent to ${email || ''}.`)
    }
  }, [])
  const handleResend = async () => {
    setLoading(true)
    const response = await resendVerificationLink(email)
    console.log(response)
    setMessage(response)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="rounded-lg p-6 text-center shadow-lg">
        <h2 className="mb-4 text-xl font-bold">{message}</h2>
        {!token && (
          <>
            <p className="">
              Check your inbox and verify your email to continue.
            </p>
            <button
              onClick={handleResend}
              disabled={loading}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-content disabled:bg-base-300 disabled:text-base-content"
            >
              {loading ? 'Resending...' : 'Resend Email'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyYourEmail
