import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { checkUserOnline } from '@/events/chatEvents'

const OnlineStatus = () => {
  const { selectedUserData } = useAppStore()

  useEffect(() => {
    // check immediately on mount
    checkUserOnline()
  }, [])
  useEffect(() => {
    if (!selectedUserData?.userId || selectedUserData?.isGroup) return

    const pingInterval = setInterval(() => {
      checkUserOnline()
    }, 5000) // every 5 seconds

    return () => clearInterval(pingInterval)
  }, [selectedUserData])

  return (
    <div className="text-sm text-gray-500">
      {selectedUserData?.isOnline ? 'Online' : 'Offline'}
    </div>
  )
}

export default OnlineStatus
