import React from 'react'
import ChatInfo from './ChatInfo'
import ChatWindow from './ChatWindow'
import ChatInputBar from './ChatInputBar'

const MessageView = () => {
  return (
    <div className="col-span-9 row-span-11 grid grid-cols-1 grid-rows-12 flex-col">
      <ChatInfo className="row-span-1" />
      <ChatWindow />
      <ChatInputBar />
    </div>
  )
}

export default MessageView
