import React, { useEffect, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { useAppStore } from '@/store'
import { Button } from './ui/button'
import ConfirmModal from './ConfirmModal'
import { toast } from 'sonner'

const FilePicker = ({ setFilePickerOpen }) => {
  const { uploadFile } = useAppStore()

  const [selectedFiles, setSelectedFiles] = useState([])

  const filePickerRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filePickerRef.current &&
        !filePickerRef.current.contains(event.target) &&
        selectedFiles.length > 0
      ) {
        document.getElementById('file_confirm_modal').show()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedFiles])
  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files)
    if (selectedFiles.length + files.length > 2) {
      toast.error('You can only upload up to 5 files.')
    } else setSelectedFiles((prevFiles) => [...prevFiles, ...files])
  }

  const handleDragOver = (event) => event.preventDefault()

  const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    if (selectedFiles.length + files.length > 5) {
      toast.error('You can only upload up to 5 files.')
    } else setSelectedFiles((prevFiles) => [...prevFiles, ...files])
    // if (onFilesSelect) onFilesSelect(files)
  }

  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedFiles)
  }

  const sendFilesHandler = () => {
    if (!selectedFiles) return
    setFilePickerOpen(false)
    setSelectedFiles([])
    // console.log(files)
    uploadFile(selectedFiles)
  }

  const handleDiscardChanges = () => {
    setSelectedFiles([])
    setFilePickerOpen(false)
  }

  return (
    <>
      <div
        ref={filePickerRef}
        className="relative flex h-96 w-96 max-w-md flex-col items-center justify-center rounded-lg bg-base-100 p-4 shadow-2xl"
        // className="relative flex h-96 w-96 max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4"
      >
        {selectedFiles.length === 0 && (
          <div
            className="flex cursor-pointer flex-col items-center justify-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload size={40} className="text-gray-500" />
            <p className="mt-2 text-gray-600">Drag & drop files here or</p>
            <label
              // tabIndex={0}
              // role="button"
              className="btn mt-2 cursor-pointer rounded-lg"
              htmlFor="fileInput"
            >
              Choose Files
            </label>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              multiple={true}
              onChange={handleFilesChange}
              accept="image/*, video/*, audio/*, .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt"
            />
          </div>
        )}

        {/* Display Selected Files */}
        <div className="mt-4 w-full space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className={`flex items-center justify-between rounded-lg border p-2 ${file.size > 10000000 ? 'border-error' : 'border-neutral'}`}
            >
              {/* File Preview */}
              {file.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="h-12 w-12 rounded-md object-cover"
                />
              )}
              {file.type.startsWith('video/') && (
                <video className="h-12 w-12 rounded-md" controls>
                  <source src={URL.createObjectURL(file)} type={file.type} />
                </video>
              )}
              {file.type.startsWith('audio/') && (
                <audio controls className="w-32">
                  <source src={URL.createObjectURL(file)} type={file.type} />
                </audio>
              )}
              {!file.type.startsWith('image/') &&
                !file.type.startsWith('video/') &&
                !file.type.startsWith('audio/') && (
                  <span className="w-32 truncate">{file.name}</span>
                )}

              {/* Remove Button */}
              <span>{file.name}</span>
              <span>{file.size}</span>
              <button
                onClick={() => removeFile(index)}
                className="ml-4 text-error-content hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Send the media files */}
        <Button
          className="btn absolute bottom-0 w-full bg-primary text-primary-content"
          onClick={sendFilesHandler}
        >
          Send
        </Button>
      </div>
      {/* Confirmation Modal */}
      <ConfirmModal
        id="file_confirm_modal"
        Title="Discard unsent file?"
        description="Your file will not be sent"
        actionText="Discard"
        funAction={handleDiscardChanges}
        cancelText="Go Back"
      />
    </>
  )
}

export default FilePicker
