import { useAppStore } from '@/store'
import { formatMessageTime } from '@/utils/formatDateTime.js'
import React, { useEffect, useRef } from 'react'

const Message = ({ data }) => {
  // console.log(data)
  const {
    message,
    senderId,
    senderName,
    createdAt,
    isNotification,
    messageType,
    fileUrl,
  } = data
  const { userInfo, selectedUserData } = useAppStore()
  //   console.log(userInfo, selectedUserData)
  const messageEndRef = useRef(null)
  useEffect(() => {
    if (messageEndRef.current && message) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [message])

  const renderMessageContent = () => {
    switch (messageType) {
      case 'text':
        return <p>{message}</p>

      case 'image':
        return (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={fileUrl}
              alt="Shared Image"
              className="max-w-xs rounded-lg"
            />
          </a>
        )

      case 'audio':
        return (
          <audio controls>
            <source src={fileUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )

      case 'video':
        return (
          <video controls className="max-w-xs rounded-lg">
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )

      case 'pdf':
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View PDF
          </a>
        )

      case 'file':
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Download File
          </a>
        )

      default:
        return <p>{message}</p>
    }
  }
  // Todo : design this notification
  return isNotification ? (
    <div className="text-center">{message}</div>
  ) : (
    <div
      className={`chat ${senderId != userInfo._id ? 'chat-start' : 'chat-end'}`}
      ref={messageEndRef}
    >
      <div className="chat-header">
        {senderId == userInfo._id ? 'You' : senderName}
      </div>
      <div className="chat-bubble chat-bubble-primary max-w-96 whitespace-pre-wrap">
        {messageType == 'file' ? <a href={fileUrl}>{fileUrl}</a> : message}
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
