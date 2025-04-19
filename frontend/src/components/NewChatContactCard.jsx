import { useAppStore } from '@/store'
import React from 'react'
import Avatar from './ui/Avatar'

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
        className="flex h-16 items-center gap-2 rounded-sm p-2 hover:bg-base-200"
        onClick={() => newChatHandler()}
      >
        <Avatar profile={user.profile} name={user.name} />
        {`${user.name}`}
      </div>
    </>
  )
}

export default NewChatContactCard
