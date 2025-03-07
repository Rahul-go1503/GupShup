import { Search, SquarePen } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import ContactCard from './contactCard'
import { ScrollArea } from './ui/scroll-area'
import { useAppStore } from '@/store'
import CreateGroup from './CreateGroup'
import NewChat from './NewChat'
import { updateUnReadMessageCount } from '@/events/chatEvents'

const Contacts = () => {
  const { isUserLoading, users, getAllContacts, selectedUserData } =
    useAppStore()
  useEffect(() => {
    getAllContacts()
  }, [])
  useEffect(() => {
    if (selectedUserData?.unReadMessageCount) {
      const data = {
        contactId: selectedUserData?._id,
        count: -selectedUserData?.unReadMessageCount,
      }
      updateUnReadMessageCount(data)
    }
  }, [selectedUserData])

  const [query, setQuery] = useState('')

  const filteredContacts = useMemo(() => {
    return users.filter((contact) => {
      // console.log(contact.name, query)
      return contact.name.toLowerCase().includes(query.toLowerCase())
    })
  }, [users, query])
  return isUserLoading ? (
    'loading...'
  ) : (
    <div className="col-span-3 row-span-11 grid grid-cols-1 grid-rows-12 border-r-2 border-r-neutral px-2">
      <div className="row-span-1 m-2 flex items-center justify-between p-2">
        <p className="font-bold">Chats</p>
        <div className="flex items-center gap-1">
          <NewChat />
          <div
            tabIndex={0}
            role="button"
            className="m-1"
            onClick={() =>
              document.getElementById('createGroup_modal').showModal()
            }
          >
            <div className="my-2 hover:cursor-pointer">
              <SquarePen />
            </div>
          </div>
        </div>
      </div>
      <div className="row-span-1 m-2 flex justify-start gap-2 rounded border-b-2 border-b-transparent bg-base-200 p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
        <div className="text-muted self-auto">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search or start a new chat"
          className="me-2 w-full rounded bg-transparent outline-none"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
          }}
        />
      </div>
      <div className="row-span-10 m-2">
        <ScrollArea className="h-full">
          {filteredContacts.map((contact, index) => (
            <ContactCard key={index} user={contact} />
          ))}
        </ScrollArea>
      </div>
      <CreateGroup />
    </div>
  )
}

export default Contacts
