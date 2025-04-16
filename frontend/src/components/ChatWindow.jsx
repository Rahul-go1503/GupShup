import React, { useEffect, useRef } from 'react'
import Message from './Message'
import { useAppStore } from '@/store'
import { formatDateTitle } from '@/utils/formatDateTime'

const ChatWindow = () => {
  const { selectedChatMessages } = useAppStore()
  const messageEndRef = useRef(null)

  const renderMessages = () => {
    let lastDate = null
    return selectedChatMessages.map((data, index) => {
      const msgDate = formatDateTitle(data.createdAt)
      const showDate = msgDate !== lastDate
      lastDate = msgDate
      return (
        <div key={index}>
          {showDate && (
            <div className="flex justify-center">
              <div className="m-2 rounded bg-base-300 p-2 text-sm font-semibold text-base-content shadow-lg">
                {lastDate}
              </div>
            </div>
          )}
          <Message data={data} />
        </div>
      )
    })
  }
  useEffect(() => {
    if (messageEndRef.current) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }, 500)
    }
  }, [selectedChatMessages])

  return (
    <div className="h-[80%] overflow-scroll">
      {renderMessages()}
      {/* Ref at the end for scrolling */}
      <div ref={messageEndRef} />
    </div>
  )
}

export default ChatWindow
