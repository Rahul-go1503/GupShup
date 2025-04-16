import BrandLogo from '@/components/ui/BrandLogo'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-[10%] items-center justify-between border-b-2 border-b-neutral bg-base-100 px-2">
        <BrandLogo />
        <nav className="flex justify-end p-2">
          <div className="mx-2 font-semibold">
            <Link to="/login">Login</Link>
          </div>
          <div className="mx-2 font-semibold text-primary">
            <Link to="/signup">Sign Up</Link>
          </div>
        </nav>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="my-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          <span className="text-primary">GupShup</span> Bringing People Closer,
        </p>
        <p className="text-muted-foreground max-w-xl text-base sm:text-lg md:text-xl">
          Seamless, secure, and smart – your ultimate chat companion
        </p>
      </main>
    </div>
  )
}

export default Home
