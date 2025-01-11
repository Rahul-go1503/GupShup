import { MessageSquarePlus, Search } from 'lucide-react'
import React, { useEffect } from 'react'
import ContactCard from './contactCard'
import { ScrollArea } from './ui/scroll-area'
import { useAppStore } from '@/store'

const Contacts = () => {
  const { isUserLoading, users, getAllUsers } = useAppStore()
  useEffect(() => {
    getAllUsers()
  }, [])

  return isUserLoading ? (
    'loading...'
  ) : (
    <>
      <div className="col-span-3 row-span-11 grid grid-cols-1 grid-rows-12 border-r-2 border-r-neutral">
        <div className="row-span-1 m-2 flex items-center justify-between p-2">
          <p className="font-bold">Chats</p>
          <div
            className="my-2 hover:cursor-pointer"
            onClick={() => document.getElementById('new_chat').showModal()}
          >
            <MessageSquarePlus />
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
          />
        </div>
        <div className="row-span-10">
          <ScrollArea className="h-full">
            {users.map((contact, index) => (
              <ContactCard key={index} user={contact} />
            ))}
          </ScrollArea>
        </div>
      </div>
      <dialog id="new_chat" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default Contacts
