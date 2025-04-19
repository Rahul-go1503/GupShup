import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import {
  Users,
  UserMinus,
  Crown,
  ChartNoAxesGantt,
  Search,
  ArrowLeft,
  UserRoundPlus,
} from 'lucide-react'
import { toast } from 'sonner'
import NewGroupContactCard from '../NewGroupContactCard'
import UserChip from '../UserChip'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import ConfirmModal from '../ConfirmModal'
import { addMember, removeMember, updateGroup } from '@/events/chatEvents'
import ProfileEditor from '../ui/ProfileEditor'
import Input from '../Input'
import Avatar from '../ui/Avatar'

const GroupChatDetailsModal = () => {
  const { userInfo, selectedUserData, users, uploadGroupProfileImage } =
    useAppStore()

  /***** States*****/
  const [editMode, setEditMode] = useState(false)
  const [chipCount, setChipCount] = useState(0)

  const [isAdmin, setIsAdmin] = useState(false)
  let initialGroupData = {
    name: selectedUserData?.name || '',
    description: selectedUserData?.description || '',
    profile: selectedUserData?.profile || '',
    members: selectedUserData?.members || [],
  }
  const [groupDetails, setGroupDetails] = useState(initialGroupData)
  useEffect(() => {
    // console.log('selectedUserData', selectedUserData)
    initialGroupData = {
      name: selectedUserData?.name || '',
      description: selectedUserData?.description || '',
      profile: selectedUserData?.profile || '',
      members: selectedUserData?.members || [],
    }
    setGroupDetails(initialGroupData)
    const admin = initialGroupData.members.some(
      (member) => member.userId._id === userInfo._id && member.isAdmin
    )
    setIsAdmin(admin)
  }, [selectedUserData])

  const nameRef = useRef(null)
  const fileInputRef = useRef(null)
  const groupChatDetailsModalRef = useRef(null)
  const isEdited = useRef(false)

  // console.log(isAdmin)
  // Handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        groupChatDetailsModalRef.current &&
        !groupChatDetailsModalRef.current.contains(event.target)
      ) {
        if (isEdited.current) {
          document.getElementById('groupChatEditConfirmModal').showModal()
        } else {
          resetState()
        }
      }
    }
    // handle esc key
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isEdited.current) {
          event.preventDefault()
          document.getElementById('groupChatEditConfirmModal').showModal()
        } else {
          resetState()
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

  // Handle input change
  const handleChange = (e) => {
    setGroupDetails({ ...groupDetails, [e.target.name]: e.target.value })
    isEdited.current = 1
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGroupDetails({ ...groupDetails, profile: reader.result })
      }
      reader.readAsDataURL(file)
      uploadGroupProfileImage(file, selectedUserData._id)
    }
  }

  // Remove group image
  const handleRemoveProfile = () => {
    setGroupDetails({ ...groupDetails, profile: null })
  }

  // Toggle Member in Group
  const removeMemberHandler = (memberId) => {
    removeMember({ groupId: selectedUserData._id, memberId })
  }

  const addMemberHandler = (members) => {
    const memberIds = members
      .filter((member) => member.selected)
      .map((member) => member.userId)
    addMember({ groupId: selectedUserData._id, memberIds })
  }

  // Toggle Admin Role
  const toggleAdmin = (memberId) => {
    toast.info('Feature not implemented yet')
    // isEdited.current = true
  }

  // Handle Edit Button Click
  const handleEditButton = () => {
    setEditMode(true)
    setTimeout(() => {
      nameRef.current?.focus()
    }, 0)
  }

  // Delete Group
  const handleDeleteGroup = () => {
    if (!isAdmin) return
    toast.info('Feature not implemented yet')
  }

  //  Add members functionality

  const [query, setQuery] = useState('')
  const [step, setStep] = useState(0)

  const allUsers = useRef([])
  const groupMemberIds = useRef()

  const [members, setMembers] = useState([])
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

  // handle selecting the member to add
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

  const closeModal = () => {
    if (groupChatDetailsModalRef.current) {
      document.getElementById('groupChatDetailsModal').close()
    }
  }
  const resetState = () => {
    // to handle the animation flucution
    setTimeout(() => {
      // setGroupDetails(initialGroupData)
      setQuery('')
      setEditMode(false)
      setMembers(allUsers.current)
      setChipCount(0)
      setStep(0)
      isEdited.current = false
    }, 100)
  }

  const handleDiscardChanges = () => {
    closeModal()
    resetState()
  }
  // Save Changes
  const handleSave = () => {
    if (!isAdmin) return
    updateGroup({
      groupId: selectedUserData._id,
      groupName: groupDetails.name,
      description: groupDetails.description,
    })
    document.getElementById('groupChatDetailsModal').close()
    setEditMode(false)
  }
  return (
    <>
      <dialog id="groupChatDetailsModal" className="modal">
        <div className="modal-box" ref={groupChatDetailsModalRef}>
          <div className="relative overflow-hidden">
            <div className="flex flex-col">
              {/* Group Profile Picture */}
              <ProfileEditor
                editMode={editMode}
                profile={groupDetails?.profile}
                name={groupDetails?.name}
                fileInputRef={fileInputRef}
                handleImageUpload={handleImageUpload}
                handleRemoveProfile={handleRemoveProfile}
              />

              {/* Group Name & Description */}
              <div className="mt-4 space-y-3">
                <Input
                  icon={<Users size={20} />}
                  refprop={nameRef}
                  type="text"
                  name="name"
                  placeholder="Enter group name"
                  value={groupDetails?.name}
                  onChange={handleChange}
                  disabled={!isAdmin || !editMode}
                />

                <Input
                  icon={<ChartNoAxesGantt size={20} />}
                  type="text"
                  name="description"
                  placeholder="Enter group description"
                  className="me-2 w-full rounded bg-transparent outline-none"
                  value={groupDetails?.description || 'No description'}
                  onChange={handleChange}
                  disabled={!isAdmin || !editMode}
                />
              </div>
              {/* Members List */}
              <div className="mt-4">
                <h3 className="text-sm font-medium">Members</h3>
                <ScrollArea className="h-64">
                  {groupDetails?.members.map((member) => (
                    <div
                      key={member.userId._id}
                      className="flex items-center justify-between gap-2 rounded-md p-2 hover:bg-base-200"
                    >
                      <Avatar
                        profile={member.userId.profile}
                        name={member.userId.firstName}
                      />
                      <span className="flex-grow">
                        {member.userId._id == userInfo._id
                          ? 'You'
                          : member.userId.firstName}
                      </span>
                      {isAdmin && editMode && (
                        <div className="flex gap-2">
                          {member.userId._id !== userInfo._id && (
                            <div
                              className="lg:tooltip lg:tooltip-left"
                              data-tip="remove"
                            >
                              <button
                                className="btn btn-outline btn-xs"
                                onClick={() =>
                                  removeMemberHandler(member.userId._id)
                                }
                              >
                                <UserMinus className="h-4 w-4" />
                              </button>
                            </div>
                          )}

                          <div
                            className={`${member.userId._id == userInfo._id ? '' : 'lg:tooltip lg:tooltip-left'}`}
                            data-tip={`${member.isAdmin ? 'remove admin' : 'make admin'}`}
                          >
                            <button
                              className={`btn btn-xs ${member.isAdmin ? 'btn-warning' : ''}`}
                              onClick={() => toggleAdmin(member.userId._id)}
                            >
                              <Crown className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-center gap-3">
                {isAdmin ? (
                  editMode ? (
                    <>
                      <Button
                        onClick={() => setStep(1)}
                        className="text-primary-content"
                      >
                        Add Members
                      </Button>
                      <Button
                        onClick={handleDeleteGroup}
                        className="btn-disabled bg-base-300"
                      >
                        Delete Group
                      </Button>
                      <Button onClick={handleSave} className="bg-base-300">
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditMode(false)}
                        className="text-primary-content"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleEditButton}
                      className="text-primary-content"
                    >
                      Edit Group
                    </Button>
                  )
                ) : (
                  <Button className="btn-disabled bg-base-300">
                    Exit Group
                  </Button>
                )}
              </div>
            </div>
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
                className="me-2 w-full rounded bg-transparent outline-none"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                }}
              />

              {/* selected member list */}
              <ScrollArea className="w-full">
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
                onClick={() => addMemberHandler(members)}
                disabled={chipCount === 0}
                className="absolute bottom-1 right-0 disabled:bg-base-200"
              >
                <UserRoundPlus />
              </Button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/* Confirmation Modal */}
      <ConfirmModal
        id="groupChatEditConfirmModal"
        Title="Unsaved Changes"
        description="Are you sure you want to discard them?"
        actionText="Yes"
        funAction={handleDiscardChanges}
        cancelText="No"
      />
    </>
  )
}

export default GroupChatDetailsModal
