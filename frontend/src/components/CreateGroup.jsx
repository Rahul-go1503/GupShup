import { MessageSquarePlus, Pencil, Search, Trash2 } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import NewGroupContactCard from './NewGroupContactCard'
import { useAppStore } from '@/store'
import UserChip from './UserChip'
import { Button } from './ui/button'
import { createNewGroup } from '@/events/chatEvents'
import { toast } from 'sonner'

const CreateGroup = () => {
  /***** States*****/
  const [groupProfile, setGroupProfile] = useState()
  const [groupProfileData, setGroupProfileData] = useState()
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [query, setQuery] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const [members, setMembers] = useState([])
  // const [chipCount, setChipCount] = useState(0)
  const [step, setStep] = useState(0)

  const { users, uploadProfileImage, removeProfileImage } = useAppStore()

  const chipCount = useRef(0) // used to detect changes as well, useRef is used to prevent unnecessary event listener re-attaches

  /***** Refs *****/
  const allUsers = useRef([])
  const dropdownRef = useRef(null)
  const fileInputRef = useRef(null)

  const resetState = () => {
    // to handle the animation flucution
    setTimeout(() => {
      setGroupName('')
      setDescription('')
      setQuery('')
      setMembers(allUsers.current)
      // setChipCount(0)
      setStep(0)
      setGroupProfile(null)
      chipCount.current = 0
    }, 10)
  }

  useEffect(() => {
    const contacts = users?.filter((contact) => !contact.isGroup)
    allUsers.current = contacts?.map((contact) => {
      return { ...contact, selected: false }
    })
    // console.log(allUsers.current)
    setMembers(allUsers.current)
  }, [users])

  useEffect(() => {
    //   handle click outside close
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log(chipCount.current)
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

  const filteredContacts = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [members, query])

  const handleSelect = (index) => {
    setMembers((prev) =>
      prev.map((member, i) => {
        if (i == index) {
          if (member.selected) chipCount.current = chipCount.current - 1
          else chipCount.current = chipCount.current + 1
          return { ...member, selected: !member.selected }
        }
        return member
      })
    )
  }
  const closeDropdown = () => {
    if (dropdownRef.current) {
      document.getElementById('createGroup_modal').close()
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    createNewGroup({
      groupProfileData,
      groupName,
      description,
      members: members
        .filter((member) => member.selected)
        .map((member) => member.userId),
    })
    closeDropdown()
    resetState()
  }

  //Todo: check for firefox
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGroupProfile(reader.result)
        const fileBase64 = reader.result.split(',')[1] // Remove Base64 prefix
        setGroupProfileData({
          file: fileBase64,
          fileType: file.type,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDiscardChanges = () => {
    document.getElementById('confirm_modal').close()
    closeDropdown()
    resetState()
  }

  return (
    <>
      <dialog id="createGroup_modal" className="modal">
        <div className="modal-box" ref={dropdownRef}>
          <h3 className="text-center font-bold">Create New Group</h3>
          <div className="relative overflow-hidden">
            <div className="mb-1 flex items-center justify-start gap-2 rounded border-b-2 border-b-transparent bg-base-200 p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
              <div className="text-muted self-auto">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search name"
                className="me-2 w-full rounded bg-transparent outline-none"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                }}
              />
            </div>

            {/* selected member list */}
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

            {/* Next Button */}
            {chipCount.current != 0 && (
              <Button
                onClick={() => {
                  setStep(1)
                }}
              >
                Next
              </Button>
            )}

            {/* Contact List */}
            <ScrollArea className="mt-2 h-64">
              {filteredContacts.map((contact, index) => (
                <NewGroupContactCard
                  key={index}
                  data={contact}
                  funHandleSelect={() => handleSelect(index)}
                />
              ))}
            </ScrollArea>
            {/* second step */}
            <div
              className={`absolute left-0 top-0 z-[10] h-full w-full bg-base-100 transition-all duration-300 ${step ? 'translate-x-0' : 'translate-x-full'} p-2`}
            >
              {/* <h3 className="text-center font-bold">Create New Group</h3> */}

              {/* Back Button */}
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

              {/* Group Profile Picture */}
              <div className="my-2 flex flex-col items-center">
                <div
                  className="relative rounded-full"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img
                    src={
                      groupProfile ||
                      'https://ui-avatars.com/api/?name=Group&color=fff'
                    }
                    alt="Group Profile"
                    className="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
                  />
                  {isHovered && (
                    <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50">
                      <div className="flex gap-2">
                        <div onClick={() => fileInputRef.current.click()}>
                          <Pencil size={20} className="text-white" />
                        </div>
                        {/* <div onClick={() => handleRemoveProfile()}>
                        <Trash2 size={20} className="text-white" />
                      </div> */}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Group Name & Description */}
              <div className="flex flex-col gap-2">
                <div className="row-span-1 mb-1 flex justify-start gap-2 rounded border-b-2 border-b-transparent bg-base-200 p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
                  <input
                    type="text"
                    placeholder="Group Name"
                    className="me-2 w-full rounded bg-transparent outline-none"
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value)
                    }}
                  />
                </div>
                <div className="row-span-1 mb-1 flex justify-start gap-2 rounded border-b-2 border-b-transparent bg-base-200 p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
                  <input
                    type="text"
                    placeholder="Group description"
                    className="me-2 w-full rounded bg-transparent outline-none"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                    }}
                  />
                </div>
                <div className="">
                  <Button onClick={handleSubmit}>Create</Button>
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
      <dialog id="confirm_modal" className="modal">
        <div className="modal-box w-1/4">
          <h3 className="text-lg font-bold">Cancel Creating Group?</h3>
          <p className="py-2">You have unsaved changes that will be lost</p>
          <div className="mt-4 flex justify-end gap-3">
            <Button onClick={handleDiscardChanges} className="w-1/2 bg-primary">
              Yes, Cancel
            </Button>
            <Button
              onClick={() => document.getElementById('confirm_modal').close()}
              className="w-1/2 bg-base-300 hover:bg-base-200/90"
            >
              Go Back
            </Button>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default CreateGroup
