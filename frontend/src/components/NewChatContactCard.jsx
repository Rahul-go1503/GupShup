import { useAppStore } from '@/store'
import React from 'react'

const NewChatContactCard = ({ user }) => {
  const { setSelectedUserData, setSelectedChatMessages, users } = useAppStore()

  const newChatHandler = () => {
    setSelectedChatMessages([])
    const contact = users.find((contact) => contact.userId == user.userId)
    console.log('newChatHandler', contact)
    if (contact) setSelectedUserData(contact)
    else setSelectedUserData(user)
  }
  return (
    <>
      <div
        className="mx-2 h-16 rounded-sm p-2 hover:bg-base-200"
        onClick={() => newChatHandler()}
      >
        <div className="avatar my-auto ps-4">
          <div className="h-10 w-10 rounded-full">
            <img
              src={
                user.profile ||
                'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
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
