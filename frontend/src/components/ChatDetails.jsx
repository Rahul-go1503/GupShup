import { useAppStore } from '@/store'
import { Pencil } from 'lucide-react'
import React from 'react'
import EditGroupSection from './EditGroup'

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
              'https://ui-avatars.com/api/?name=' +
                selectedUserData?.name.split(' ').join('+') +
                '&background=random&color=fff'
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

        {selectedUserData?.isGroup && (
          <div
            onClick={() => document.getElementById('group_modal').showModal()}
          >
            <Pencil />
          </div>
        )}
      </div>
      <EditGroupSection />
    </div>
  )
}

export default ChatDetails
