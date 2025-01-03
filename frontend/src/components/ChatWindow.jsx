import React from 'react'
import Message from './Message'
import { ScrollArea } from './ui/scroll-area'
import { useAppStore } from '@/store'

const ChatWindow = () => {
  const { selectedChatMessages } = useAppStore()
  // const {message, createdAt, fromSelf} = selectedChatMessages
  return (
    <>
      {/* console.log(data) */}
      <div className="row-span-10 bg-primary/5">
        <ScrollArea className="h-full">
          {selectedChatMessages.map((data, index) => (
            <Message key={index} data={data} />
          ))}
        </ScrollArea>
      </div>
    </>
  )
}

export default ChatWindow
