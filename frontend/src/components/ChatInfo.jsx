import { useAppStore } from '@/store'
import React from 'react'

const ChatInfo = () => {
  const { selectedUserData } = useAppStore()
  return (
    <div className="row-span-1">
      ChatInfo - {selectedUserData ? selectedUserData.firstName : 'User'}
    </div>
  )
}

export default ChatInfo
