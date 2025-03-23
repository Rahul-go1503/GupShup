import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-error">404</h1>
      <p className="text-lg text-gray-600">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-content"
      >
        Go Home
      </Link>
    </div>
  )
}

export default NotFound
