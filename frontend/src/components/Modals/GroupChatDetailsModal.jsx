import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Users, ChartNoAxesGantt } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmModal from '../ConfirmModal'
import ProfileEditor from '../ui/ProfileEditor'
import Input from '../Input'
import MemberList from './MemberList'
import AddMembers from './AddMembers'
import { handleBack } from '@/utils/handleBack'
import { closeModal } from '@/utils/closeModal'
import { deleteGroup, exitGroup } from '@/events/chatEvents'

const GroupChatDetailsModal = () => {
  const { userInfo, selectedUserData, updateGroupDetails } = useAppStore()

  /***** States*****/
  const [editMode, setEditMode] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [groupDetails, setGroupDetails] = useState(selectedUserData)
  const [step, setStep] = useState(0)
  const [confirmModalParams, setConfirmModalParams] = useState()

  /***** Refs *****/
  const nameRef = useRef(null)
  const groupChatDetailsModalRef = useRef(null)
  const isEdited = useRef(false)

  useEffect(() => {
    // Todo: provide admin details from backend
    const admin = selectedUserData.members.some(
      (member) => member.userId._id === userInfo._id && member.isAdmin
    )
    setGroupDetails(selectedUserData)
    setIsAdmin(admin)
  }, [selectedUserData])

  useEffect(() => {
    const helper = () => {
      if (isEdited.current) {
        setConfirmModalParams({
          Title: 'Unsaved Changes',
          description: 'Are you sure you want to discard them?',
          actionText: 'Yes',
          cancelText: 'No',
          funAction: handleDiscardChanges,
        })
        document.getElementById('groupChatEditConfirmModal').showModal()
      } else resetState()
    }

    const cleanup = handleBack({
      modalRef: groupChatDetailsModalRef,
      funAction: helper,
    })

    return cleanup
  }, [])

  // Handle input change
  const handleChange = (e) => {
    setGroupDetails({ ...groupDetails, [e.target.name]: e.target.value })
    isEdited.current = 1
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
    // console.log()
    setConfirmModalParams({
      description: `Are you sure you want to delete ${groupDetails.name}?`,
      actionText: 'Delete',
      cancelText: 'Cancel',
      funAction: () => deleteGroup({ groupId: selectedUserData._id }),
    })
    document.getElementById('groupChatEditConfirmModal').showModal()
  }

  const handleExitGroup = () => {
    setConfirmModalParams({
      description: `Are you sure you want to exit ${groupDetails.name}?`,
      actionText: 'Exit',
      cancelText: 'Cancel',
      funAction: () => exitGroup({ groupId: selectedUserData._id }),
    })
    document.getElementById('groupChatEditConfirmModal').showModal()
  }

  const resetState = () => {
    // to handle the animation flucution
    setTimeout(() => {
      setEditMode(false)
      setStep(0)
      isEdited.current = false
    }, 100)
  }

  const handleDiscardChanges = () => {
    if (groupChatDetailsModalRef.current) {
      document.getElementById('groupChatDetailsModal').close()
    }
    resetState()
  }
  // Save Changes
  const handleSave = async () => {
    if (!isAdmin) return
    await updateGroupDetails(groupDetails)
    setGroupDetails(selectedUserData)
    resetState()
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
                name={groupDetails?.name}
                data={groupDetails}
                setData={setGroupDetails}
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
                  value={
                    groupDetails?.description ||
                    (!editMode ? 'No description' : '')
                  }
                  onChange={handleChange}
                  disabled={!isAdmin || !editMode}
                />
              </div>
              {/* Members List */}
              <MemberList members={groupDetails?.members} editMode={editMode} />

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
                        className="bg-base-300"
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
                  <Button onClick={handleExitGroup} className="bg-base-300">
                    Exit Group
                  </Button>
                )}
              </div>
              <AddMembers
                data={groupDetails?.members}
                step={step}
                setStep={setStep}
                isEdited={isEdited}
              />
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
        Title={confirmModalParams?.Title}
        description={confirmModalParams?.description}
        actionText={confirmModalParams?.actionText}
        cancelText={confirmModalParams?.cancelText}
        funAction={confirmModalParams?.funAction}
        funCancel={confirmModalParams?.funCancel}
      />
    </>
  )
}

export default GroupChatDetailsModal
