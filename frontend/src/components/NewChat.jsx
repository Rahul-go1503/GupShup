import { axiosInstance } from '@/config/axios'
import { SEARCH_ROUTE } from '@/utils/constants'
import { Search, UserRoundPlus } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import NewChatContactCard from './NewChatContactCard.jsx'
import { ScrollArea } from './ui/scroll-area.jsx'
import { useAppStore } from '@/store/index.js'
import Input from './Input.jsx'

const NewChat = () => {
  const [contacts, setContacts] = useState([])
  const [query, setQuery] = useState('')

  const { users } = useAppStore()
  const dropdownRef = useRef(null)
  const newChatInputRef = useRef(null)

  const dropdownOpenHandler = () => {
    setTimeout(() => newChatInputRef.current?.focus(), 0)
  }
  const existingContacts = users
    .filter((contact) => !contact.isGroup)
    .sort((a, b) => a.name.localeCompare(b.name))

  useEffect(() => {
    setContacts(existingContacts)
  }, [])

  // Todo: replace from here
  const searchUsers = async (query) => {
    try {
      setQuery(query)
      const res = await axiosInstance.get(SEARCH_ROUTE, {
        params: { searchTerm: query },
      })
      setContacts(res.data)
    } catch (err) {
      toast.error(err.response?.data.message)
    }
  }
  //   handle on dropdown close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setContacts(existingContacts)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div className="dropdown max-sm:dropdown-end" ref={dropdownRef}>
      <div
        tabIndex={0}
        role="button"
        className="m-1"
        onClick={dropdownOpenHandler}
      >
        <div className="my-2 hover:cursor-pointer">
          <UserRoundPlus />
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] w-64 rounded-box bg-base-300 p-4 shadow-2xl md:w-72"
      >
        <div>
          <p className="my-2 text-lg font-semibold">New Chat</p>
          <Input
            refprop={newChatInputRef}
            icon={<Search size={20} />}
            type="text"
            placeholder="Search user name or email"
            value={query}
            onChange={(e) => searchUsers(e.target.value)}
          />
          <ScrollArea className="my-1 h-64">
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
