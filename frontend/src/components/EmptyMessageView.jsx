const EmptyMessageView = () => {
  return (
    <div className="hidden w-screen flex-col items-center justify-center rounded-lg md:flex md:w-3/4">
      <h1 className="mb-2 text-4xl font-extrabold">
        Welcome to <span className="text-primary">GupShup</span>
      </h1>
      <p className="md:text-md font-light sm:text-sm lg:text-lg">
        Bringing people closer, one message at a time.
      </p>
      <p className="md:text-md mt-4 font-medium sm:text-sm">
        Seamless, secure, and smart – your ultimate chat companion.
      </p>
    </div>
  )
}

export default EmptyMessageView
