import React from 'react'
import Contacts from '@/components/Contacts'
import EmptyMessageView from '@/components/EmptyMessageView'
import Header from '@/components/Header'
import MessageView from '@/components/MessageView'
import { useAppStore } from '@/store'

const Chat = () => {
  const { selectedUserData } = useAppStore()
  return (
    <div className="bg-background grid h-screen grid-cols-12 grid-rows-12">
      <Header />
      <Contacts />
      {selectedUserData !== undefined ? <MessageView /> : <EmptyMessageView />}
    </div>
  )
}

export default Chat
