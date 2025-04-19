import ChatInfo from './ChatInfo'
import ChatWindow from './ChatWindow'
import ChatInputBar from './ChatInputBar'
import { useAppStore } from '@/store'

const MessageView = () => {
  const { isChatsLoading } = useAppStore()
  return isChatsLoading ? (
    <p>loading....</p>
  ) : (
    <div className="flex w-full flex-col md:w-3/4">
      <ChatInfo />
      <ChatWindow />
      <ChatInputBar />
    </div>
  )
}

export default MessageView
