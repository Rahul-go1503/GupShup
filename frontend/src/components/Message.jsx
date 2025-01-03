import { useAppStore } from '@/store'
import React from 'react'

const Message = ({ data }) => {
  const { message, senderId, createdAt } = data
  const { userInfo } = useAppStore()
  //   console.log(userInfo, selectedUserData)
  return (
    <div className={`m-2 ms-auto w-fit max-w-60 rounded-lg bg-primary/10 p-2`}>
      <p>{message}</p>
      <p>{createdAt}</p>
      <p>{senderId == userInfo._id ? 'true' : 'false'}</p>
      {/* <p>
        {from === userinfo.userId
          ? userinfo.firstname
          : selectedUserData.firstname}
      </p> */}
    </div>
  )
}

export default Message
