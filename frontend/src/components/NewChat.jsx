import { axiosInstance } from '@/config/axios'
import { SEARCH_ROUTE } from '@/utils/constants'
import { Search, UserRoundPlus } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import NewChatContactCard from './NewChatContactCard.jsx'
import { ScrollArea } from './ui/scroll-area.jsx'
import { useAppStore } from '@/store/index.js'

const NewChat = () => {
  const [contacts, setContacts] = useState([])
  const [query, setQuery] = useState('')
  const [newChat, setNewChat] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  const { users } = useAppStore()
  const dropdownRef = useRef(null)
  const searchUsers = async (query) => {
    // console.log(searhTerm)
    // return
    setQuery(query)
    try {
      const res = await axiosInstance.get(SEARCH_ROUTE, {
        params: { searchTerm: query },
      })
      //   console.log(res.data)
      setContacts(res.data)
    } catch (err) {
      console.log('Error in Searching: ', err)
      toast.error('Something Went Wrong')
    }
  }
  // useEffect(() => {
  //   setContacts(users)
  // }, [])
  //   handle on dropdown close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setContacts([])
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="m-1">
        <div className="my-2 hover:cursor-pointer">
          <UserRoundPlus />
        </div>
      </div>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact relative z-[1] w-64 bg-base-100 p-2 text-primary-content shadow"
        ref={dropdownRef}
      >
        <div>
          <p className="font-bold text-black">New Chat</p>
          <div className="row-span-1 flex justify-start gap-2 rounded border-b-2 border-b-transparent bg-base-200 p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
            <div className="text-muted self-auto">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="w-full rounded bg-transparent outline-none"
              value={query}
              onChange={(e) => searchUsers(e.target.value)}
            />
          </div>
          <ScrollArea className="h-64">
            {contacts.map((contact, index) => (
              <NewChatContactCard key={index} user={contact} />
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default NewChat
