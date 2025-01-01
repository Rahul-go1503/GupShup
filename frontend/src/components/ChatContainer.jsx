import React from 'react'
import Contacts from './Contacts'
import MessageView from './MessageView'

const ChatContainer = () => {
  return (
    <>
      <Contacts className='col-span-3 row-span-11'/>
      <MessageView className='col-span-9 row-span-11'/>
    </>
  )
}

export default ChatContainer