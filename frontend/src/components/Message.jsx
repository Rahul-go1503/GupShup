import { useAppStore } from '@/store'
import { formatMessageTime } from '@/utils/formatDateTime.js'
import { File } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

const Message = ({ data }) => {
  const {
    message,
    senderId,
    senderName,
    createdAt,
    isNotification,
    messageType,
    fileUrl,
  } = data
  const { userInfo } = useAppStore()

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
              className="max-h-72 min-w-72 rounded-lg object-cover"
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
          <video controls className="max-h-72 min-w-72 rounded-lg object-cover">
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )

      case 'pdf':
        return (
          <div className="flex items-center justify-center gap-2">
            <File size={20} />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View PDF
            </a>
          </div>
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
    <div className="flex justify-center">
      <div className="my-1 rounded bg-base-200 bg-opacity-50 p-1 text-xs font-light italic">
        {message}
      </div>
    </div>
  ) : (
    <div
      className={`chat ${senderId != userInfo._id ? 'chat-start' : 'chat-end'}`}
      // ref={messageEndRef}
    >
      <div className="chat-header">
        {senderId == userInfo._id ? 'You' : senderName}
      </div>
      <div
        className={`chat-bubble ${senderId != userInfo._id ? 'bg-base-300 text-base-content' : 'chat-bubble-primary'} max-h-96 max-w-96 whitespace-pre-wrap p-2`}
      >
        {renderMessageContent()}
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
