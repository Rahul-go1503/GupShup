import { useAppStore } from '@/store'
import { Paperclip, SendHorizontal, Smile } from 'lucide-react'
import React, { useState } from 'react'

const ChatInputBar = () => {
  const [message, setMessage] = useState('')
  const { userInfo, selectedUserData, sendMessage } = useAppStore()
  const sendHandler = () => {
    // console.log(message)
    sendMessage({ message, to: selectedUserData._id })
    setMessage('')
  }
  const handleKeyPress = (e) => {
    //Enter
    if (e.shiftKey) return
    if (e.keyCode == 13) {
      sendHandler()
    }
  }
  return (
    <>
      <div className="row-span-1 flex items-center justify-around gap-2 px-2">
        <Smile />
        <Paperclip />
        <textarea
          // type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full resize-none bg-transparent outline-none"
          onKeyDown={(e) => handleKeyPress(e)}
          rows={1}
        />
        <div onClick={() => sendHandler()}>
          <SendHorizontal />
        </div>
      </div>
    </>
  )
}

export default ChatInputBar
