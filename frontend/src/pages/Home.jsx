import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="flex h-screen flex-col">
      <nav className="flex justify-end p-2">
        <div className="mx-2 font-semibold">
          <Link to="/login">Login</Link>
        </div>
        <div className="mx-2 font-semibold text-primary">
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>
      <main className="flex flex-1 flex-col items-center justify-center">
        <p className="my-4 text-5xl font-bold">
          <span className="text-primary">GupShup</span> Bringing People Closer,
          {/* One Message at a Time. */}
        </p>
        <p className="text-xl">
          Seamless, secure, and smart – your ultimate chat companion
        </p>
      </main>
    </div>
  )
}

export default Home
