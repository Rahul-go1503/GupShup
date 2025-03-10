import { useAppStore } from '@/store'
import React from 'react'

const NewChatContactCard = ({ user }) => {
  const { setSelectedUserData, setSelectedChatMessages, users } = useAppStore()

  const newChatHandler = () => {
    setSelectedChatMessages([])
    const contact = users.find((contact) => contact.userId == user.userId)
    if (contact) setSelectedUserData(contact)
    else setSelectedUserData(user)
  }
  return (
    <>
      <div
        className="flex h-16 items-center gap-2 rounded-sm hover:bg-base-200"
        onClick={() => newChatHandler()}
      >
        <div className="avatar my-auto">
          <div className="h-10 w-10 rounded-full">
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
        {`${user.name}`}
      </div>
    </>
  )
}

export default NewChatContactCard
