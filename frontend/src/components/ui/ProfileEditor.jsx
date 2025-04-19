import { Pencil, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

const ProfileEditor = ({
  editMode,
  profile,
  name,
  fileInputRef,
  handleImageUpload,
  handleRemoveProfile,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={
            profile ||
            'https://ui-avatars.com/api/?name=' +
              name?.split(' ').join('+') +
              '&background=random&color=fff'
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
  )
}

export default ProfileEditor
