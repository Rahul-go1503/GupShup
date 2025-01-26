import { useAppStore } from '@/store'
import React from 'react'

const ChatDetails = () => {
  const { selectedUserData } = useAppStore()
  return (
    <div
      tabIndex={0}
      className="card dropdown-content card-compact z-[1] w-64 bg-base-200 p-4 shadow-lg"
    >
      <div className="flex flex-col items-center space-x-4">
        {/* <div className="avatar"> */}
        <div className="rounded-full">
          <img
            src={
              selectedUserData?.profile ||
              'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            }
            alt="User Avatar"
          />
        </div>
        {/* </div> */}
        <div>
          <p className="text-lg font-semibold">
            {selectedUserData?.name || 'Unknown User'}
          </p>
          <p className="text-sm font-light">
            {selectedUserData?.status || 'No status available'}
          </p>
          <p className="text-sm font-light">
            {selectedUserData?.email || 'No email available'}
          </p>
        </div>

        {selectedUserData?.isGroup && <div>extra grp details</div>}
      </div>
    </div>
  )
}

export default ChatDetails
