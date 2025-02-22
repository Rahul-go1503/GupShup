import { useAppStore } from '@/store'
import { formatLastMessageTime } from '@/utils/formatDateTime'
import React from 'react'

const ContactCard = ({ user }) => {
  const { selectedUserData, setSelectedUserData } = useAppStore()

  const contactClickHandler = () => {
    setSelectedUserData(user)
  }

  return (
    <div
      className={`grid w-full cursor-pointer grid-cols-12 grid-rows-1 items-center justify-between rounded-lg p-2 transition-all ${selectedUserData?._id === user._id ? 'bg-primary/10' : 'hover:bg-primary/5'}`}
      onClick={contactClickHandler}
    >
      {/* Avatar Section */}
      <div className="avatar col-span-2">
        <div className="h-12 w-12 rounded-full ring-1 ring-primary">
          <img
            src={
              user.profile ||
              'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            }
            alt={user.name}
          />
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="col-span-9">
        <p className="w-5/6 truncate font-medium">{user.name}</p>
        <p className="w-5/6 truncate text-sm">
          {user.latestMessage || 'No messages yet'}
        </p>
      </div>

      {/* Status and Time Section */}
      <div className="col-span-1 flex flex-col items-end gap-1">
        {user.unReadMessageCount > 0 && (
          <div className="badge badge-primary px-2 py-1 text-xs">
            {user.unReadMessageCount}
          </div>
        )}
        {user.latestMessageAt && (
          <p className="text-xs">
            {formatLastMessageTime(user.latestMessageAt)}
          </p>
        )}
      </div>
    </div>
  )
}

export default ContactCard
