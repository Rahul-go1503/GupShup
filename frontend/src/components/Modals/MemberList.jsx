import { ScrollArea } from '@radix-ui/react-scroll-area'
import React, { useState } from 'react'
import Avatar from '../ui/Avatar'
import { Crown, UserMinus } from 'lucide-react'
import { useAppStore } from '@/store'
import { removeMember, toggleGroupAdmin } from '@/events/chatEvents'
import ConfirmModal from '../ConfirmModal'

const MemberList = ({ members, editMode }) => {
  const { userInfo, selectedUserData } = useAppStore()
  const [confirmModalParams, setConfirmModalParams] = useState({
    description: 'Are you sure you want to remove?',
    actionText: 'Yes',
    funAction: () => {},
    cancelText: 'No',
  })
  const removeMemberHandler = (memberId) => {
    removeMember({ groupId: selectedUserData._id, memberId })
  }

  const toggleAdminHandler = (memberId, isAdmin) => {
    toggleGroupAdmin({ groupId: selectedUserData._id, memberId, isAdmin })
  }

  const openRemoveConfirmModal = (member) => {
    setConfirmModalParams({
      description: `Are you sure you want to remove ${member.firstName}?`,
      funAction: () => removeMemberHandler(member._id),
    })
    document.getElementById('groupChatEditMembersConfirmModal').showModal()
  }
  // Toggle Admin Role
  const openToggleAdminConfirmModal = (member) => {
    setConfirmModalParams({
      description: `Are you sure you want to ${member.isAdmin ? 'remove admin' : 'make admin'}?`,
      funAction: () => toggleAdminHandler(member.userId._id, !member.isAdmin),
    })
    document.getElementById('groupChatEditMembersConfirmModal').showModal()
  }
  return (
    <>
      <div className="mt-4">
        <h3 className="text-sm font-medium">Members</h3>
        <ScrollArea className="h-64">
          {members?.map((member) => (
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
              {editMode && (
                <div className="flex gap-2">
                  {member.userId._id !== userInfo._id && (
                    <div
                      className="lg:tooltip lg:tooltip-left"
                      data-tip="remove"
                    >
                      <button
                        className="btn btn-outline btn-xs"
                        onClick={() => openRemoveConfirmModal(member.userId)}
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
                      onClick={() => openToggleAdminConfirmModal(member)}
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
      {/* Confirmation Modal */}
      <ConfirmModal
        id="groupChatEditMembersConfirmModal"
        description={confirmModalParams.description}
        actionText="Yes"
        funAction={confirmModalParams.funAction}
        cancelText="No"
      />
    </>
  )
}

export default MemberList
