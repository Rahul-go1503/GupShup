import { useAppStore } from '@/store'
import { Phone, Video } from 'lucide-react'
import React from 'react'
import GroupChatDetailsModal from './Modals/groupChatDetailsModal'
import PrivateChatDetailsModal from './Modals/privateChatDetailsModal'

const ChatInfo = () => {
  const { selectedUserData } = useAppStore()

  const handleChatDetailsModal = () => {
    let modal = document.getElementById('privateChatDetailsModal')
    if (selectedUserData?.isGroup) {
      modal = document.getElementById('groupChatDetailsModal')
    }
    modal.showModal()
  }
  return (
    <>
      <div className="row-span-1 p-1 shadow-sm">
        <div className="m-auto flex items-center justify-between self-center">
          {/* User Info Section */}
          <div
            className="flex items-center space-x-4"
            onClick={handleChatDetailsModal}
          >
            {/* <div className="dropdown dropdown-right"> */}
            <div tabIndex={0} className="cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className="avatar">
                  <div className="h-12 w-12 rounded-full">
                    <img
                      src={
                        selectedUserData?.profile ||
                        'https://ui-avatars.com/api/?name=' +
                          selectedUserData.name.split(' ').join('+') +
                          '&background=random&color=fff'
                      }
                      alt="User Avatar"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {selectedUserData?.name || 'User Name'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-4">
            <button className="hover:bg-primary-focus btn rounded-sm p-2 shadow">
              <Video className="h-6 w-6" />
            </button>
            <button className="hover:bg-primary-focus btn p-2 shadow">
              <Phone className="h-6 w-6" />
            </button>
          </div>
        </div>
        {/* <EditGroupSection /> */}
      </div>
      <PrivateChatDetailsModal />
      <GroupChatDetailsModal />
    </>
  )
}

export default ChatInfo
