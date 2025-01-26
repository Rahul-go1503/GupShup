import React from 'react'
import Message from './Message'
import { ScrollArea } from './ui/scroll-area'
import { useAppStore } from '@/store'
import { formatDateTitle } from '@/utils/formatDateTime'

const ChatWindow = () => {
  const { selectedChatMessages } = useAppStore()
  // const {message, createdAt, fromSelf} = selectedChatMessages
  const renderMessages = () => {
    let lastDate = null
    return selectedChatMessages.map((data, index) => {
      const msgDate = formatDateTitle(data.createdAt)
      const showDate = msgDate !== lastDate
      lastDate = msgDate
      return (
        <div key={index}>
          {showDate && <div className="text-center">{lastDate}</div>}
          <Message data={data} />
        </div>
      )
    })
  }
  return (
    <>
      {/* console.log(data) */}
      <div className="row-span-8 bg-primary/5">
        <ScrollArea className="h-full">{renderMessages()}</ScrollArea>
      </div>
    </>
  )
}

export default ChatWindow
