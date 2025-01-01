import { useAppStore } from '@/store'
import React from 'react'

const ContactCard = ({ user }) => {
  const { selectedUserData, setSelectedUserData } = useAppStore.getState()
  const selectedChatHandler = () => {
    // console.log(setSelectedUserData)
    setSelectedUserData(user)
    // console.log(selectedUserData)
  }
  return (
    <>
      <div
        className="mx-2 h-16 rounded-sm p-2 hover:bg-base-200"
        onClick={() => selectedChatHandler()}
      >
        ContactCard - {user.firstName}
      </div>
    </>
  )
}

export default ContactCard
