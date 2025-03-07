import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Users, UserPlus, UserMinus, Crown } from 'lucide-react'
import { toast } from 'sonner'

const EditGroupSection = () => {
  const { userInfo, selectedGroupData } = useAppStore()
  const [editMode, setEditMode] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const initialGroupData = {
    name: selectedGroupData?.name || '',
    description: selectedGroupData?.description || '',
    profile: selectedGroupData?.profile || '',
    members: selectedGroupData?.members || [],
  }

  const [groupDetails, setGroupDetails] = useState(initialGroupData)
  const nameRef = useRef(null)
  const fileInputRef = useRef(null)
  const modalRef = useRef(null)

  const isAdmin = true
  // groupDetails.members.some(
  //   (member) => member.userId._id === userInfo._id && member.isAdmin
  // )

  // Handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && modalRef.current === event.target) {
        document.getElementById('group_modal').close()
        setTimeout(() => {
          setEditMode(false)
          setGroupDetails(initialGroupData)
        }, 1000)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle input change
  const handleChange = (e) => {
    setGroupDetails({ ...groupDetails, [e.target.name]: e.target.value })
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
      uploadGroupImage(file)
    }
  }

  // Remove group image
  const handleRemoveProfile = () => {
    setGroupDetails({ ...groupDetails, profile: null })
    removeGroupImage()
  }

  // Toggle Member in Group
  const toggleMember = (memberId) => {
    if (groupDetails.members.some((member) => member.userId._id === memberId)) {
      setGroupDetails({
        ...groupDetails,
        members: groupDetails.members.filter((id) => id !== memberId),
      })
    } else {
      setGroupDetails({
        ...groupDetails,
        members: [...groupDetails.members, memberId],
      })
    }
  }

  // Toggle Admin Role
  const toggleAdmin = (memberId) => {
    if (groupDetails.members.some((member) => member.userId._id === memberId)) {
      setGroupDetails({
        ...groupDetails,
        admins: groupDetails.admins.filter((id) => id !== memberId),
      })
    } else {
      setGroupDetails({
        ...groupDetails,
        admins: [...groupDetails.admins, memberId],
      })
    }
  }

  // Handle Edit Button Click
  const handleEditButton = () => {
    setEditMode(true)
    setTimeout(() => {
      nameRef.current?.focus()
    }, 0)
  }

  // Save Changes
  const handleSave = () => {
    if (!isAdmin) return
    updateGroupInfo(groupDetails)
    toast.success('Group updated successfully!')
    document.getElementById('group_modal').close()
    setEditMode(false)
  }

  // Delete Group
  const handleDeleteGroup = () => {
    if (!isAdmin) return
    toast('Are you sure?', {
      action: {
        label: 'Delete',
        onClick: () => {
          toast.success('Group deleted!')
          // Call API to delete group
        },
      },
    })
  }

  return (
    <dialog id="group_modal" className="modal" ref={modalRef}>
      <div className="modal-box">
        {/* Group Profile Picture */}
        <div className="flex flex-col items-center">
          <div
            className="relative rounded-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={
                groupDetails.profile ||
                'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
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
                  <div onClick={handleRemoveProfile}>
                    <Trash2 size={20} className="text-white" />
                  </div>
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
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-gray-600">Group Name</label>
            <input
              ref={nameRef}
              type="text"
              name="name"
              className="input input-bordered w-full"
              value={groupDetails.name}
              onChange={handleChange}
              disabled={!isAdmin}
            />
          </div>

          <div>
            <label className="block text-gray-600">Description</label>
            <input
              type="text"
              name="description"
              className="input input-bordered w-full"
              value={groupDetails.description}
              onChange={handleChange}
              disabled={!isAdmin}
            />
          </div>
        </div>

        {/* Members List */}
        <div className="mt-4">
          <h3 className="text-sm font-medium">Members</h3>
          <ul className="max-h-40 overflow-y-auto rounded-md border p-2">
            {groupDetails.members.map((member) => (
              <li
                key={member.userId._id}
                className="flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
              >
                <span>{member.userId.firstName}</span>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline btn-xs"
                      onClick={() => toggleMember(member.userId._id)}
                    >
                      {groupDetails.members.some(
                        (member) => member.userId._id === member.userId._id
                      ) ? (
                        <UserMinus className="h-4 w-4" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                    </button>
                    {groupDetails.members.some(
                      (member) => member.userId._id === member.userId._id
                    ) && (
                      <button
                        className="btn btn-warning btn-xs"
                        onClick={() => toggleAdmin(member.userId._id)}
                      >
                        {groupDetails.members.some(
                          (member) => member.userId._id === member.userId._id
                        ) ? (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Crown className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-3">
          {true ? (
            <>
              <Button onClick={handleSave}>Save</Button>
              <Button
                onClick={handleDeleteGroup}
                className="bg-red-500 text-white"
              >
                Delete Group
              </Button>
            </>
          ) : (
            <Button className="btn-disabled">View Only</Button>
          )}
        </div>
      </div>
    </dialog>
  )
}

export default EditGroupSection
