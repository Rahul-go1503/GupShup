import { useAppStore } from '@/store'
import React from 'react'

const ChatInfo = () => {
  const { selectedUserData } = useAppStore()
  return (
    <div className="row-span-1 flex justify-start gap-3">
      <div className="avatar my-auto ps-4">
        <div className="h-10 w-10 rounded-full">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <div className="my-auto">
        <p>{selectedUserData && selectedUserData.firstName}</p>
        <p className="text-sm font-light">Online</p>
      </div>
    </div>
  )
}

export default ChatInfo
