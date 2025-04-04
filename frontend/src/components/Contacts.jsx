import { Search, SquarePen } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import ContactCard from './ContactCard'
import { ScrollArea } from './ui/scroll-area'
import { useAppStore } from '@/store'
import CreateGroup from './CreateGroup'
import NewChat from './NewChat'
import { updateUnReadMessageCount } from '@/events/chatEvents'
import Input from './Input'

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
      return contact.name.toLowerCase().includes(query?.toLowerCase() || '')
    })
  }, [users, query])
  return isUserLoading ? (
    <div className="col-span-3 row-span-11">'loading...'</div>
  ) : (
    <div className="col-span-3 row-span-11 flex flex-col border-r-2 border-r-neutral px-2">
      <div className="flex items-center justify-between px-2">
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
      <Input
        icon={<Search size={20} />}
        type="text"
        placeholder="Search or start a new chat"
        className="me-2 w-full rounded bg-transparent outline-none"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
      />
      <div className="overflow-y-auto">
        <ScrollArea className="">
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
