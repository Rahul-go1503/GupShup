import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store' // Zustand store for managing userInfo state
import { Button } from '@/components/ui/button'
import { Mail, Pencil, Trash2, User } from 'lucide-react'
import { toast } from 'sonner'

const EditProfileSection = () => {
  const { userInfo, updateUserInfo, uploadProfileImage, removeProfileImage } =
    useAppStore() // Zustand store
  const [editMode, setEditMode] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const initialProfileData = {
    firstName: userInfo?.firstName || '',
    email: userInfo?.email || '',
    bio: userInfo?.bio || '',
    profile: userInfo?.profile || '',
  }
  const [profileData, setProfileData] = useState(initialProfileData)

  const nameRef = useRef(null)
  const fileInputRef = useRef(null)
  const modalRef = useRef(null)

  // handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && modalRef.current == event.target) {
        document.getElementById('profile_modal').close()

        // to handle the animation flucution
        setTimeout(() => {
          setEditMode(false)
          setProfileData(initialProfileData)
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
    // console.log(e.target)
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData({ ...profileData, profile: reader.result })
      }
      reader.readAsDataURL(file)
      // console.log(file)
      uploadProfileImage(file)
      // setProfileData({ ...profileData, fileKey: key })
      // upload
    }
  }

  const handleRemoveProfile = () => {
    setProfileData({
      ...profileData,
      profile: null,
    })
    removeProfileImage()
  }

  const handleEditButton = () => {
    setEditMode(true)
    setTimeout(() => {
      nameRef.current?.focus() // Focus on the input after rendering
    }, 0)
  }
  // Save changes
  const handleSave = () => {
    if (
      profileData.firstName != userInfo.firstName ||
      profileData.email != userInfo.email
    ) {
      const data = {
        firstName: profileData.firstName,
        email: profileData.email,
      }
      // console.log(data)
      updateUserInfo(data)
    }
    // else console.log(false)
    document.getElementById('profile_modal').close()
    setEditMode(false)
  }
  return (
    <dialog id="profile_modal" className="modal" ref={modalRef}>
      <div className="modal-box">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div
            className="relative rounded-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={
                profileData.profile ||
                'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
              }
              alt="Profile"
              className="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
            />
            {editMode && isHovered && (
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
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-gray-600">Name</label>
            <div className="row-span-1 mb-1 flex justify-start gap-2 rounded border-b-2 border-b-transparent p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
              <div className="text-muted self-auto">
                <User size={20} />
              </div>
              <input
                ref={nameRef}
                type="text"
                placeholder="Search or start a new chat"
                name="firstName"
                className="me-2 w-full rounded bg-transparent outline-none"
                value={profileData.firstName}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600">Email</label>
            <div className="row-span-1 mb-1 flex justify-start gap-2 rounded border-b-2 border-b-transparent p-2 transition-all duration-300 focus-within:border-b-accent focus-within:bg-base-200">
              <div className="text-muted self-auto">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                className="me-2 w-full rounded bg-transparent outline-none"
                value={profileData.email}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-3">
          {editMode ? (
            <>
              <Button onClick={handleSave} className="">
                Save
              </Button>
              <Button
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEditButton} className="">
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </dialog>
  )
}

export default EditProfileSection
