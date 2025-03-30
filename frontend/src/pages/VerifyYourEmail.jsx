import { useAppStore } from '@/store'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const VerifyYourEmail = () => {
  const {
    email,
    verifyEmail,
    verifyEmailMessage,
    setVerifyEmailMessage,
    resendVerificationLink,
  } = useAppStore()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      verifyEmail(token, navigate)
    } else if (!email) {
      navigate('/')
    } else {
      setVerifyEmailMessage(
        `A verification link has been sent to ${email || ''}.`
      )
    }
  }, [])
  const handleResend = async () => {
    setLoading(true)
    const response = await resendVerificationLink(email, navigate)
    // console.log(response)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="rounded-lg p-6 text-center shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Verify your Email</h2>
        <p className="mb-4 text-lg">{verifyEmailMessage}</p>
        {!token && (
          <>
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
