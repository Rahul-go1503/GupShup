import { ArrowLeft, Search, UserRoundPlus } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Input from '../Input'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import UserChip from '../UserChip'
import NewGroupContactCard from '../NewGroupContactCard'
import { Button } from '../ui/button'
import { useAppStore } from '@/store'
import { addMember } from '@/events/chatEvents'

const AddMembers = ({ data, step, setStep, isEdited }) => {
  const [query, setQuery] = useState('')

  const allUsers = useRef([])
  const groupMemberIds = useRef()
  const [chipCount, setChipCount] = useState(0)

  const [members, setMembers] = useState([])
  const { users, selectedUserData } = useAppStore()
  useEffect(() => {
    const contacts = users?.filter((contact) => !contact.isGroup)
    allUsers.current = contacts?.map((contact) => {
      return { ...contact, selected: false }
    })

    groupMemberIds.current = new Set(
      selectedUserData?.members?.map((member) => member.userId._id)
    )
    // console.log(allUsers.current)
    setMembers(allUsers.current)
  }, [users])
  const filteredContacts = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [members, query])

  const handleSelect = (index) => {
    setMembers((prev) =>
      prev.map((member, i) => {
        if (i == index) {
          if (member.selected) setChipCount((prev) => prev - 1)
          else setChipCount((prev) => prev + 1)
          return { ...member, selected: !member.selected }
        }
        return member
      })
    )
    isEdited.current = true
  }

  const addMemberHandler = () => {
    const memberIds = members
      .filter((member) => member.selected)
      .map((member) => member.userId)
    addMember({ groupId: selectedUserData._id, memberIds })
    setStep(0)
    isEdited.current = false
  }
  return (
    <div
      className={`absolute left-0 top-0 z-[10] flex h-full w-full flex-col bg-base-100 transition-all duration-300 ${step ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Back Button */}
      <div
        className="p-2"
        onClick={() => {
          setStep(0), setQuery('')
        }}
      >
        <ArrowLeft size={20} />
      </div>
      {/* Search contacts */}

      <Input
        icon={<Search size={20} />}
        name="search"
        type="text"
        placeholder="Search name"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
      />

      {/* selected member list */}
      <ScrollArea className="w-full">
        <div className="flex gap-1">
          {data?.map(
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

      {/* Contact List */}

      <ScrollArea className="mt-2">
        {filteredContacts.map((contact, index) => (
          // console.log(groupMemberIds.has(contact._id))
          <NewGroupContactCard
            key={index}
            data={contact}
            funHandleSelect={() => handleSelect(index)}
            disabled={groupMemberIds.current.has(contact.userId)}
          />
        ))}
      </ScrollArea>

      {/* OKay Button */}
      <Button
        onClick={addMemberHandler}
        disabled={chipCount === 0}
        className="absolute bottom-1 right-0 disabled:bg-base-200"
      >
        <UserRoundPlus />
      </Button>
    </div>
  )
}

export default AddMembers
