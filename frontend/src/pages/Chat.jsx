import React from 'react'
import Contacts from '@/components/Contacts'
import EmptyMessageView from '@/components/EmptyMessageView'
import Header from '@/components/Header'
import MessageView from '@/components/MessageView'
import { useAppStore } from '@/store'

const Chat = () => {
  const { selectedUserData } = useAppStore()
  return (
    <div className="bg-background flex h-screen flex-col">
      <Header />
      <div className="flex h-[90%]">
        <Contacts />
        {selectedUserData !== undefined ? (
          <MessageView />
        ) : (
          <EmptyMessageView />
        )}
      </div>
    </div>
  )
}

export default Chat
