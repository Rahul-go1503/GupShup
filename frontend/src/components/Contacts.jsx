import { Search, SquarePen, UserRoundPlus } from 'lucide-react'
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
    <div className="w-screen md:w-1/4">'loading...'</div>
  ) : (
    <div
      className={`w-screen flex-col border-r-2 border-r-neutral bg-base-100 px-2 md:flex md:w-1/4 ${selectedUserData ? 'hidden' : 'flex'}`}
    >
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
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
      />
      {filteredContacts.length > 0 ? (
        <div className="overflow-y-auto">
          <ScrollArea className="">
            {filteredContacts.map((contact, index) => (
              <ContactCard key={index} user={contact} />
            ))}
          </ScrollArea>
        </div>
      ) : (
        <div className="flex h-full w-full justify-center">
          <p className="text-sm italic">
            No chats yet. Click the
            <span className="inline-flex items-center">
              <UserRoundPlus size={16} className="m-1" />
            </span>
            icon to start a conversation!
          </p>
        </div>
      )}
      <CreateGroup />
    </div>
  )
}

export default Contacts
