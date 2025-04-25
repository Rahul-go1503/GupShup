import { Info, Search, UserRoundPlus, Users } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import NewGroupContactCard from './NewGroupContactCard'
import { useAppStore } from '@/store'
import UserChip from './UserChip'
import { Button } from './ui/button'
import { createNewGroup } from '@/events/chatEvents'
import ConfirmModal from './ConfirmModal'
import Input from './Input'
import ProfileEditor from './ui/ProfileEditor'

const CreateGroup = () => {
  /***** States*****/
  const [groupDetails, setGroupDetails] = useState({
    name: '',
    description: '',
    profile: null,
  })
  const [query, setQuery] = useState('')

  const [members, setMembers] = useState([])
  // const [chipCount, setChipCount] = useState(0)
  const [step, setStep] = useState(0)
  const { users } = useAppStore()

  /***** Refs *****/
  const allUsers = useRef([])
  const modalRef = useRef(null)
  const chipCount = useRef(0) // used to detect changes as well, useRef is used to prevent unnecessary event listener re-attaches

  /***** Effects *****/
  useEffect(() => {
    //   handle click outside close
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // console.log(chipCount.current)
        if (chipCount.current > 0) {
          document.getElementById('confirm_modal').showModal()
        }
      }
    }

    // handle esc key
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (chipCount.current > 0) {
          event.preventDefault()
          document.getElementById('confirm_modal').showModal()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const contacts = users?.filter((contact) => !contact.isGroup)
    allUsers.current = contacts?.map((contact) => {
      return { ...contact, selected: false }
    })
    // console.log(allUsers.current)
    setMembers(allUsers.current)
  }, [users])
  /***** Functions *****/

  const filteredContacts = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [members, query])

  const handleSelect = (userId) => {
    setMembers((prev) =>
      prev.map((member, i) => {
        if (member.userId == userId) {
          if (member.selected) chipCount.current = chipCount.current - 1
          else chipCount.current = chipCount.current + 1
          return { ...member, selected: !member.selected }
        }
        return member
      })
    )
  }
  const handleChange = (e) => {
    setGroupDetails({ ...groupDetails, [e.target.name]: e.target.value })
    // isEdited.current = 1
  }
  //Todo: check for firefox
  // Handle image upload

  const closeModal = () => {
    if (modalRef.current) {
      document.getElementById('createGroup_modal').close()
    }
  }

  const resetState = () => {
    // to handle the animation flucution
    setTimeout(() => {
      setGroupDetails({
        name: '',
        description: '',
        profile: null,
      })
      setQuery('')
      setMembers(allUsers.current)
      // setChipCount(0)
      setStep(0)
      chipCount.current = 0
    }, 10)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    let groupProfileData
    if (groupDetails?.profile) {
      const fileBase64 = groupDetails.profile.split(',')[1] // Remove Base64 prefix
      groupProfileData = {
        file: fileBase64,
        fileType: groupDetails.file.type,
      }
    }
    const selectedMemberIds = members
      .filter((member) => member.selected)
      .map((member) => member.userId)
    createNewGroup({
      groupProfileData,
      groupName: groupDetails.name,
      description: groupDetails.description,
      members: selectedMemberIds,
    })
    closeModal()
    resetState()
  }
  const handleDiscardChanges = () => {
    closeModal()
    resetState()
  }

  return (
    <>
      <dialog id="createGroup_modal" className="modal">
        <div className="modal-box" ref={modalRef}>
          <h3 className="text-center font-bold">Create New Group</h3>
          <div className="relative overflow-hidden">
            {/* Search contacts */}

            <Input
              icon={<Search size={20} />}
              type="text"
              placeholder="Search name"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
              }}
            />

            {/* selected member list */}
            <ScrollArea className="overflow-x my-1">
              <div className="flex gap-1">
                {members.map(
                  (member, index) =>
                    member.selected && (
                      <UserChip
                        key={index}
                        data={member.name}
                        funHandleRemove={() => handleSelect(member.userId)}
                      />
                    )
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Next Button */}
            {chipCount.current != 0 && (
              <Button
                onClick={() => {
                  setStep(1)
                }}
                className="text-primary-content"
              >
                Next
              </Button>
            )}

            {/* Contact List */}
            {filteredContacts.length > 0 ? (
              <ScrollArea className="mt-2 h-64">
                {filteredContacts.map((contact, index) => (
                  <NewGroupContactCard
                    key={index}
                    data={contact}
                    funHandleSelect={() => handleSelect(contact.userId)}
                  />
                ))}
              </ScrollArea>
            ) : (
              // <div className="flex h-full w-full justify-center">
              <p className="text-sm italic">
                No contacts yet. Click the
                <span className="inline-flex items-center">
                  <UserRoundPlus size={16} className="m-1" />
                </span>
                icon to start a conversation!
              </p>
              // </div>
            )}
            {/* second step */}
            <div
              className={`absolute left-0 top-0 z-[10] h-full w-full bg-base-100 transition-all duration-300 ${step ? 'translate-x-0' : 'translate-x-full'} p-2`}
            >
              {/* Group Profile Picture */}
              <ProfileEditor
                name="Group"
                data={groupDetails}
                setData={setGroupDetails}
              />

              {/* Group Name & Description */}
              <div className="flex flex-col gap-2">
                <Input
                  // label="Group Name"
                  icon={<Users size={20} />}
                  type="text"
                  placeholder="Group Name"
                  name="name"
                  value={groupDetails?.name}
                  onChange={handleChange}
                />
                <Input
                  icon={<Info size={20} />}
                  type="text"
                  placeholder="Group description"
                  value={groupDetails?.description}
                  name="description"
                  onChange={handleChange}
                />
                <div className="mt-4 flex justify-center gap-2">
                  <Button
                    onClick={handleSubmit}
                    className="w-1/3 text-primary-content"
                  >
                    Create
                  </Button>
                  <Button
                    onClick={() => {
                      setStep(0), setQuery('')
                    }}
                    className="w-1/3 bg-base-300 hover:bg-base-200/90"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/* Confirmation Modal */}
      <ConfirmModal
        id="confirm_modal"
        Title="Cancel Creating Group?"
        description="You have unsaved changes that will be lost"
        actionText="Yes, Cancel"
        funAction={handleDiscardChanges}
        cancelText="Go Back"
      />
    </>
  )
}

export default CreateGroup
