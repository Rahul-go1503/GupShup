import { useAppStore } from '@/store'
import { formatMessageTime } from '@/utils/formatMessageTime.js'
import React, { useEffect, useRef } from 'react'

const Message = ({ data }) => {
  const { message, senderId, createdAt } = data
  const { userInfo, selectedUserData } = useAppStore()
  //   console.log(userInfo, selectedUserData)
  const messageEndRef = useRef(null)
  useEffect(() => {
    if (messageEndRef.current && message) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [message])
  return (
    <div
      className={`chat ${senderId != userInfo._id ? 'chat-start' : 'chat-end'}`}
      ref={messageEndRef}
    >
      <div className="chat-header">
        {senderId == userInfo._id ? 'You' : selectedUserData.firstName}
      </div>
      <div className="chat-bubble chat-bubble-primary max-w-96 whitespace-pre-wrap">
        {message}
      </div>
      <div className="chat-footer opacity-50">
        <time className="text-xs opacity-50" dateTime={createdAt}>
          {formatMessageTime(createdAt)}
        </time>
      </div>
    </div>
  )
}

export default Message
