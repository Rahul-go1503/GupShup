import { createNewChat, sendMessage } from '@/events/messageEvents.js'
import { useAppStore } from '@/store'
import EmojiPicker from 'emoji-picker-react'
import { Paperclip, SendHorizontal, Smile } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import FilePicker from './FilePicker'

const ChatInputBar = () => {
  const [message, setMessage] = useState('')
  const { selectedUserData } = useAppStore()

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [filePickerOpen, setFilePickerOpen] = useState(false)

  const emojiRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setEmojiPickerOpen])

  const sendHandler = () => {
    // console.log(message)
    const { _id, userId } = selectedUserData
    if (_id) {
      sendMessage({ message, id: _id })
    } else {
      createNewChat({ message, id: userId })
    }
    setMessage('')
  }
  const handleKeyPress = (e) => {
    //Enter
    if (e.shiftKey) return
    if (e.keyCode == 13) {
      sendHandler()
    }
  }

  return (
    <>
      <div className="row-span-1 flex items-center justify-around gap-2 px-2">
        <div className="relative">
          <div onClick={() => setEmojiPickerOpen(true)}>
            <Smile />
          </div>
          <div className="absolute bottom-10 left-0" ref={emojiRef}>
            <EmojiPicker
              open={emojiPickerOpen}
              onEmojiClick={(e) => setMessage(message + e.emoji)}
              previewConfig={{ showPreview: false }}
              emojiStyle="native"
              lazyLoadEmojis={true}
              skinTonesDisabled={true}
              // onSkinToneChange={(e) => console.log(e)}
            />
          </div>
        </div>
        <div className="relative">
          <div onClick={() => setFilePickerOpen(true)}>
            <Paperclip />
          </div>
          {filePickerOpen && (
            <div className="absolute bottom-10 left-0">
              <FilePicker setFilePickerOpen={setFilePickerOpen} />
            </div>
          )}
        </div>
        <textarea
          // type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full resize-none bg-transparent outline-none"
          onKeyDown={(e) => handleKeyPress(e)}
          rows={1}
        />
        <div onClick={() => sendHandler()}>
          <SendHorizontal />
        </div>
      </div>
    </>
  )
}

export default ChatInputBar
