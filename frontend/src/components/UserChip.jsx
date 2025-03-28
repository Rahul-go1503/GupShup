import { X } from 'lucide-react'
import React from 'react'

const UserChip = ({ data, funHandleRemove }) => {
  return (
    <div className="flex items-center gap-1 rounded-full bg-primary p-2 text-primary-content">
      <p className="text-sm font-medium">{data}</p>
      <button onClick={funHandleRemove} className="rounded-full p-0">
        <X size={16} />
      </button>
    </div>
  )
}

export default UserChip
