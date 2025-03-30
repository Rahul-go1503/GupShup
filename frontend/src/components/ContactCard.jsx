import { useAppStore } from '@/store'
import { formatLastMessageTime } from '@/utils/formatDateTime'
import React from 'react'

const ContactCard = ({ user }) => {
  const { selectedUserData, setSelectedUserData, userInfo } = useAppStore()

  const contactClickHandler = () => {
    setSelectedUserData(user)
  }

  return (
    <div
      className={`grid w-full cursor-pointer grid-cols-12 items-center gap-2 rounded-lg p-2 py-2 transition-all ${selectedUserData?._id === user._id ? 'bg-primary/10' : 'hover:bg-primary/5'}`}
      onClick={contactClickHandler}
    >
      {/* Avatar Section */}
      <div className="avatar col-span-2">
        <div className="h-12 w-12 rounded-full">
          <img
            src={
              user.profile ||
              'https://ui-avatars.com/api/?name=' +
                user.name.split(' ').join('+') +
                '&background=random&color=fff'
            }
            alt={user.name}
          />
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="col-span-7">
        <p className="truncate font-medium">{user.name}</p>
        <p className="truncate text-sm">
          {(!user.isNotification
            ? (user.senderId == userInfo._id ? 'You' : user.senderName) + ': '
            : '') + user.message || 'No messages yet'}
        </p>
      </div>

      {/* Status and Time Section */}
      <div className="col-span-3 flex flex-col items-end gap-1 place-self-start justify-self-end">
        {user.createdAt && (
          <span className="text-xs">
            {formatLastMessageTime(user.createdAt)}
          </span>
        )}
        {user.unReadMessageCount > 0 && (
          <div className="badge badge-primary px-2 py-1 text-xs">
            {user.unReadMessageCount}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactCard
