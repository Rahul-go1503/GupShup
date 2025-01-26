import { MessagesSquare } from 'lucide-react'
import React from 'react'

const EmptyMessageView = () => {
  return (
    <div className="col-span-9 row-span-11 flex flex-col items-center justify-center rounded-lg shadow-md">
      {/* <main className="flex flex-1 flex-col items-center justify-center"> */}
      <div className="mb-6 flex items-center">
        <MessagesSquare className="h-16 w-16 text-primary" />
      </div>
      <h1 className="mb-2 text-4xl font-extrabold">
        Welcome to <span className="text-primary">GupShup</span>
      </h1>
      <p className="text-lg font-light">
        Bringing people closer, one message at a time.
      </p>
      <p className="text-md mt-4 font-medium">
        Seamless, secure, and smart – your ultimate chat companion.
      </p>
      {/* </main> */}
    </div>
  )
}

export default EmptyMessageView
