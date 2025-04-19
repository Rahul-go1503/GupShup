import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store' // Zustand store for managing userInfo state
import { Button } from '@/components/ui/button'
import { Mail, User } from 'lucide-react'
import Input from './Input'
import ProfileEditor from './ui/ProfileEditor'

const EditProfileSection = () => {
  const { userInfo, updateUserInfo, uploadProfileImage, removeProfileImage } =
    useAppStore() // Zustand store
  const [editMode, setEditMode] = useState(false)

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
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  //Todo: check for firefox
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData({ ...profileData, profile: reader.result })
      }
      reader.readAsDataURL(file)
      uploadProfileImage(file)
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
      updateUserInfo(data)
    }
    document.getElementById('profile_modal').close()
    setEditMode(false)
  }
  return (
    <dialog id="profile_modal" className="modal" ref={modalRef}>
      <div className="modal-box">
        {/* Profile Picture */}
        <ProfileEditor
          editMode={editMode}
          profile={profileData.profile}
          name={profileData.firstName}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          handleRemoveProfile={handleRemoveProfile}
        />

        {/* Profile Details */}
        <div className="mt-4 space-y-3">
          <Input
            label="Name"
            icon={<User size={20} />}
            refprop={nameRef}
            type="text"
            placeholder="Enter name"
            name="firstName"
            className="me-2 w-full rounded bg-transparent outline-none"
            value={profileData.firstName}
            onChange={handleChange}
            disabled={!editMode}
          />

          <Input
            label="Email"
            icon={<Mail size={20} />}
            type="email"
            placeholder="Enter email"
            name="email"
            className="me-2 w-full rounded bg-transparent outline-none"
            value={profileData.email}
            onChange={handleChange}
            disabled={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-3">
          {editMode ? (
            <>
              <Button onClick={handleSave} className="text-primary-content">
                Save
              </Button>
              <Button onClick={() => setEditMode(false)} variant="Secondary">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEditButton} className="text-primary-content">
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </dialog>
  )
}

export default EditProfileSection
