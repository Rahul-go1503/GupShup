import { Paperclip, SendHorizontal, Smile } from 'lucide-react'
import React, { useState } from 'react'

const ChatInputBar = () => {
  const [message, setMessage] = useState('')
  return (
    <>
      <div className="row-span-1 flex items-center justify-around gap-2 px-2">
        <Smile />
        <Paperclip />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full bg-transparent outline-none"
        />
        <SendHorizontal />
      </div>
    </>
  )
}

export default ChatInputBar
