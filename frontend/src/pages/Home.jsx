import ThemeController from '@/components/ThemeController'
import BrandLogo from '@/components/ui/BrandLogo'
import { Github } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <div className="h-[90vh]">
        <div className="flex h-[10%] items-center justify-between border-b-2 border-b-neutral bg-base-100 px-2">
          <BrandLogo />
          <nav className="flex justify-end gap-2 p-2">
            <div className="mx-2 font-semibold">
              <Link
                to="https://github.com/Rahul-go1503/GupShup"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
              </Link>
            </div>
            <ThemeController />
            <div className="font-semibold">
              <Link to="/login">Login</Link>
            </div>
            <div className="font-semibold text-primary">
              <Link to="/signup">Sign Up</Link>
            </div>
          </nav>
        </div>

        {/* <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="my-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          <span className="text-primary">GupShup</span> Bringing People Closer,
        </p>
        <p className="text-muted-foreground max-w-xl text-base sm:text-lg md:text-xl">
          Seamless, secure, and smart – your ultimate chat companion
        </p>
      </main> */}
        <main className="flex h-[80%] flex-1 flex-col items-center justify-center bg-base-100 px-4 text-center">
          <h1 className="mb-4 text-5xl font-extrabold sm:text-6xl md:text-7xl">
            <span className="text-primary">GupShup</span>: Bringing People
            Closer
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xl text-lg sm:text-xl md:text-2xl">
            Seamless, secure, and smart – your ultimate chat companion
          </p>
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="btn btn-primary rounded-xl px-6 text-lg font-bold"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/Rahul-go1503/GupShup"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline rounded-xl px-6 text-lg font-bold"
            >
              GitHub
            </a>
          </div>
        </main>
      </div>

      <section className="bg-base-200 py-16">
        <h2 className="mb-12 text-center text-4xl font-bold">Why GupShup?</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl bg-base-100 p-6 shadow-md">
            <h3 className="mb-2 text-xl font-semibold">🔐 Secure Messaging</h3>
            <p>
              End-to-end encrypted chats with token-based auth & AWS protected
              files.
            </p>
          </div>
          <div className="rounded-xl bg-base-100 p-6 shadow-md">
            <h3 className="mb-2 text-xl font-semibold">
              💬 1-on-1 & Group Chats
            </h3>
            <p>
              Whether you're vibing with a buddy or hosting a squad, we got you
              covered.
            </p>
          </div>
          <div className="rounded-xl bg-base-100 p-6 shadow-md">
            <h3 className="mb-2 text-xl font-semibold">⚡ Real-time Updates</h3>
            <p>
              Built with sockets for instant message sync and smooth delivery.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-base-100 py-16">
        <h2 className="mb-8 text-center text-4xl font-bold">Sneak Peek 👀</h2>
        <div className="flex flex-wrap justify-center gap-6 px-6">
          <img
            src="/Assets/Chat.png"
            className="w-full max-w-sm rounded-xl shadow-lg"
            alt="Chat screenshot 1"
          />
          <img
            src="/Assets/GroupSettings.png"
            className="w-full max-w-sm rounded-xl shadow-lg"
            alt="Chat screenshot 2"
          />
          <img
            src="/Assets/OnlineTyping.png"
            className="w-full max-w-sm rounded-xl shadow-lg"
            alt="Chat screenshot 3"
          />
        </div>
      </section>
      <footer className="mt-12 border-t bg-base-200 py-8">
        <div className="flex flex-col items-center justify-between px-6 md:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; 2025 GupShup. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <a
              href="https://github.com/Rahul-go1503/GupShup"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="hover:text-primary" />
            </a>
            <Link to="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Home
