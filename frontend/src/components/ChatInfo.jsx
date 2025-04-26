import { useAppStore } from '@/store'
import { ArrowLeft, Phone, Video } from 'lucide-react'
import GroupChatDetailsModal from './Modals/GroupChatDetailsModal'
import PrivateChatDetailsModal from './Modals/PrivateChatDetailsModal'
import { toast } from 'sonner'
import Avatar from './ui/Avatar'
import OnlineStatus from './OnlineStatus'
import { TypingIndicator } from './TypingIndicator'

const ChatInfo = () => {
  const { selectedUserData, setSelectedUserData, typingUsers } = useAppStore()

  const handleChatDetailsModal = () => {
    let modal = document.getElementById('privateChatDetailsModal')
    if (selectedUserData?.isGroup) {
      modal = document.getElementById('groupChatDetailsModal')
    }
    modal.showModal()
  }
  return (
    <>
      <div className="h-[10%] p-1 py-2 shadow-sm">
        <div className="m-auto flex items-center justify-between self-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedUserData(undefined)}
              className="text-sm text-neutral-500 md:hidden"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            {/* User Info Section */}
            <div className="flex items-center" onClick={handleChatDetailsModal}>
              {/* <div className="dropdown dropdown-right"> */}
              <div tabIndex={0} className="cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Avatar
                    profile={selectedUserData?.profile}
                    name={selectedUserData?.name}
                    size={12}
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">
                      {selectedUserData?.name || 'User Name'}
                    </p>
                    {typingUsers.length !== 0 ? (
                      <TypingIndicator />
                    ) : (
                      <OnlineStatus />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-4">
            <button
              className="hover:bg-primary-focus btn p-2 shadow"
              onClick={() => toast.info('This feature is not available yet')}
            >
              <Video className="h-6 w-6" />
            </button>
            <button
              className="hover:bg-primary-focus btn p-2 shadow"
              onClick={() => toast.info('This feature is not available yet')}
            >
              <Phone className="h-6 w-6" />
            </button>
          </div>
        </div>
        {/* <EditGroupSection /> */}
      </div>
      {selectedUserData?.isGroup ? (
        <GroupChatDetailsModal />
      ) : (
        <PrivateChatDetailsModal />
      )}
    </>
  )
}

export default ChatInfo
