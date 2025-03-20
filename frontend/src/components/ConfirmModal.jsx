import { Button } from './ui/button'

const ConfirmModal = ({
  id,
  Title,
  description,
  actionText,
  cancelText,
  funAction,
  funCancel = () => {},
}) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-1/4">
        <h3 className="text-lg font-bold">{Title}</h3>
        <p className="py-2">{description}</p>
        <div className="mt-4 flex justify-end gap-3">
          <Button
            onClick={() => {
              document.getElementById(id).close(), funAction()
            }}
            className="w-1/2 bg-primary"
          >
            {actionText}
          </Button>
          <Button
            onClick={() => {
              document.getElementById(id).close(), funCancel()
            }}
            className="w-1/2 bg-base-300 hover:bg-base-200/90"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmModal
