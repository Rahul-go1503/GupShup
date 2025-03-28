import { createNewChat, sendMessage } from '@/events/messageEvents.js'
import { useAppStore } from '@/store'
import EmojiPicker from 'emoji-picker-react'
import { Paperclip, SendHorizontal, Smile } from 'lucide-react'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import FilePicker from './FilePicker'

const ChatInputBar = () => {
  const [message, setMessage] = useState('')
  const { selectedUserData } = useAppStore()

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [filePickerOpen, setFilePickerOpen] = useState(false)

  const emojiRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()

    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const sendHandler = useCallback(() => {
    if (!message.trim()) return

    const { _id, userId } = selectedUserData
    if (_id) {
      sendMessage({ message, id: _id })
    } else {
      createNewChat({ message, id: userId })
    }
    setMessage('')
  }, [message, selectedUserData])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendHandler()
      }
    },
    [sendHandler]
  )

  return (
    <div className="row-span-1 flex items-center gap-2 px-2">
      {/* Emoji Picker */}
      <div className="relative">
        <button
          aria-label="Open emoji picker"
          onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
        >
          <Smile />
        </button>
        {emojiPickerOpen && (
          <div className="absolute bottom-10 left-0" ref={emojiRef}>
            <EmojiPicker
              open={emojiPickerOpen}
              onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
              previewConfig={{ showPreview: false }}
              emojiStyle="native"
              lazyLoadEmojis={true}
              skinTonesDisabled={true}
            />
          </div>
        )}
      </div>

      {/* File Picker */}
      <div className="relative">
        <button
          aria-label="Attach file"
          onClick={() => setFilePickerOpen(!filePickerOpen)}
        >
          <Paperclip />
        </button>
        {filePickerOpen && (
          <div className="absolute bottom-10 left-0">
            <FilePicker setFilePickerOpen={setFilePickerOpen} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="w-full resize-none bg-transparent outline-none"
        onKeyDown={handleKeyDown}
        rows={1}
      />

      {/* Send Button */}
      <button aria-label="Send message" onClick={sendHandler}>
        <SendHorizontal />
      </button>
    </div>
  )
}

export default ChatInputBar
