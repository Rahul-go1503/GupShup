import React, { useEffect } from 'react'
import ChatInfo from './ChatInfo'
import ChatWindow from './ChatWindow'
import ChatInputBar from './ChatInputBar'
import { useAppStore } from '@/store'

const MessageView = () => {
  const { isChatsLoading, selectedUserData, getAllMessagesById } = useAppStore()
  useEffect(() => {
    if (selectedUserData._id) getAllMessagesById(selectedUserData._id)
  }, [selectedUserData])
  return isChatsLoading ? (
    <p>loading....</p>
  ) : (
    <div className="grid w-full grid-cols-1 grid-rows-10 md:w-3/4">
      <ChatInfo />
      <ChatWindow />
      <ChatInputBar />
    </div>
  )
}

export default MessageView
