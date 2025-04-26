import { useAppStore } from '@/store'

export const TypingIndicator = () => {
  const { typingUsers } = useAppStore()

  // if (typingUsers.length === 0) return null
  return (
    <div className="text-muted text-xs">
      {typingUsers.length === 1
        ? `${typingUsers[0]} is typing...`
        : `${typingUsers.join(', ')} are typing...`}
    </div>
  )
}
