import { useAppStore } from '@/store'
import React from 'react'

const ContactCard = ({ user }) => {
  const { setSelectedUserData } = useAppStore()
  return (
    <>
      <div
        className="mx-2 h-16 rounded-sm p-2 hover:bg-base-200"
        onClick={() => setSelectedUserData(user)}
      >
        ContactCard - {user.firstName}
      </div>
    </>
  )
}

export default ContactCard
