import { MessageSquarePlus, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import ContactCard from './contactCard'
import { ScrollArea } from './ui/scroll-area'
import { axiosInstance } from '@/config/axios'
import { ALL_USER_ROUTE } from '@/utils/constants'
import { toast } from 'sonner'
import { useAppStore } from '@/store'

const Contacts = () => {
  const { isUserLoading, users, getAllUsers } = useAppStore()
  useEffect(() => {
    getAllUsers()
  }, [])

  return isUserLoading ? (
    'loading...'
  ) : (
    <div className="col-span-3 row-span-11 grid grid-cols-1 grid-rows-12 border-r-2 border-r-neutral">
      <div className="row-span-1 m-2 flex items-center justify-between p-2">
        <p className="font-bold">Chats</p>
        <div className="my-2">
          <MessageSquarePlus />
        </div>
      </div>
      <div className="m-2 flex justify-start gap-2 rounded border-b-2 border-b-transparent bg-base-200 p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
        <div className="text-muted self-auto">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search or start a new chat"
          className="me-2 w-full rounded bg-transparent outline-none"
        />
      </div>
      <div>
        <ScrollArea>
          {users.map((contact, index) => (
            <ContactCard key={index} user={contact} />
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

export default Contacts
