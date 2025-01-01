import ChatContainer from '@/components/ChatContainer'
import Contacts from '@/components/Contacts'
import EmptyMessageView from '@/components/EmptyMessageView'
import Header from '@/components/Header'
import MessageView from '@/components/MessageView'
import { useAppStore } from '@/store'
import React, { useEffect } from 'react'

const Chat2 = () => {
  const { selectedUserData } = useAppStore()
  // console.log(selectedUserData)
  useEffect(() => {}, [selectedUserData])
  return (
    <div className="bg-background grid h-screen grid-cols-12 grid-rows-12">
      <Header />
      <Contacts />
      {/* <MessageView /> */}
      {selectedUserData !== undefined ? <MessageView /> : <EmptyMessageView />}
    </div>
  )
}

export default Chat2