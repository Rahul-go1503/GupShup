import { useAppStore } from '@/store'

const PrivateChatDetailsModal = () => {
  const { selectedUserData } = useAppStore()
  return (
    <dialog id="privateChatDetailsModal" className="modal">
      <div className="modal-box">
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
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default PrivateChatDetailsModal
