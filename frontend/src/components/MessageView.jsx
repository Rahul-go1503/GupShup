import React, { useEffect } from 'react'
import ChatInfo from './ChatInfo'
import ChatWindow from './ChatWindow'
import ChatInputBar from './ChatInputBar'
import { useAppStore } from '@/store'

const MessageView = () => {
  const { isChatsLoading, selectedUserData, getAllMessagesById } = useAppStore()
  useEffect(() => {
    if (selectedUserData._id) getAllMessagesById(selectedUserData._id)
  }, [selectedUserData, getAllMessagesById])
  return isChatsLoading ? (
    <p>loading....</p>
  ) : (
    <div className="col-span-9 row-span-11 grid grid-cols-1 grid-rows-10">
      <ChatInfo />
      <ChatWindow />
      <ChatInputBar />
    </div>
  )
}

export default MessageView
