import { MessageSquarePlus, Search } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import NewGroupContactCard from './NewGroupContactCard'
import { useAppStore } from '@/store'
import UserChip from './UserChip'
import { Button } from './ui/button'
import { createNewGroup } from '@/events/chatEvents'

const CreateGroup = () => {
  /***** States*****/
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [query, setQuery] = useState('')

  const [members, setMembers] = useState([])
  const [chipCount, setChipCount] = useState(0)
  const [step, setStep] = useState(0)

  const { users } = useAppStore()

  /***** Refs *****/
  const allUsers = useRef([])
  const dropdownRef = useRef(null)

  const resetState = () => {
    setGroupName('')
    setDescription('')
    setQuery('')
    setMembers(allUsers.current)
    setChipCount(0)
    setStep(0)
  }

  useEffect(() => {
    const contacts = users?.filter((contact) => !contact.isGroup)
    allUsers.current = contacts?.map((contact) => {
      return { ...contact, selected: false }
    })
    // console.log(allUsers.current)
    setMembers(allUsers.current)
  }, [users])

  //   handle on dropdown close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        resetState()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredContacts = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [members, query])

  const handleSelect = (index) => {
    setMembers((prev) =>
      prev.map((member, i) => {
        if (i == index) {
          if (member.selected) setChipCount((prev) => --prev)
          else setChipCount((prev) => ++prev)
          return { ...member, selected: !member.selected }
        }
        return member
      })
    )
  }
  //Todo: not working will check
  const closeDropdown = () => {
    console.log('triggered')
    console.log('triggered inside', dropdownRef.current)
    if (dropdownRef.current) {
      console.log('triggered inside', dropdownRef.current)
      //   dropdownRef.current.removeAttribute('open')
      dropdownRef.current.classList.remove('dropdown-open')
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    createNewGroup({
      groupName,
      description,
      members: members
        .filter((member) => member.selected)
        .map((member) => member.userId),
    })
    closeDropdown()
    resetState()
  }

  return (
    <div className="dropdown dropdown-right" ref={dropdownRef}>
      <div tabIndex={0} role="button" className="m-1">
        <div className="my-2 hover:cursor-pointer">
          <MessageSquarePlus />
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content relative z-10 overflow-hidden bg-base-300"
      >
        <div className="card card-compact h-96 w-64 bg-base-300 p-2 shadow">
          <h3 className="text-center font-bold">Create New Group</h3>
          <div>
            <div className="row-span-1 mb-1 flex justify-start gap-2 rounded border-b-2 border-b-transparent p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
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
            <ScrollArea className="my-1 w-full">
              <div className="flex gap-1">
                {members.map(
                  (member, index) =>
                    member.selected && (
                      <UserChip
                        key={index}
                        data={member.name}
                        funHandleRemove={() => handleSelect(index)}
                      />
                    )
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {chipCount != 0 && (
              <Button
                onClick={() => {
                  setStep(1)
                }}
              >
                Next
              </Button>
            )}
            <ScrollArea className="mt-2 h-64">
              {filteredContacts.map((contact, index) => (
                <NewGroupContactCard
                  key={index}
                  data={contact}
                  funHandleSelect={() => handleSelect(index)}
                />
              ))}
            </ScrollArea>
          </div>
        </div>
        <div
          className={`card card-compact absolute left-0 top-0 z-[1] h-96 w-64 bg-base-300 transition-all duration-300 ${step ? 'translate-x-0' : 'translate-x-full'} p-2 shadow`}
        >
          <h3 className="text-center font-bold">Create New Group</h3>
          <div>
            {
              <Button
                onClick={() => {
                  setStep(0), setQuery('')
                }}
              >
                Back
              </Button>
            }
          </div>
          <div className="">
            <form
              onSubmit={handleSubmit}
              style={{ maxWidth: '500px', margin: 'auto' }}
            >
              <h3 className="text-center font-bold">Create New Group</h3>
              <div>
                <label>Group Name:</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                  }}
                />
              </div>
              <div>
                <label>Group Description:</label>
                <textarea
                  value={description}
                  rows={2}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter group description"
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                  }}
                />
              </div>
            </form>
            <div className="">
              <button
                style={{
                  marginTop: '15px',
                  padding: '10px',
                  background: 'blue',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={handleSubmit}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateGroup
