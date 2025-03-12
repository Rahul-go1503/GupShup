import { X } from 'lucide-react'
import React from 'react'

const UserChip = ({ data, funHandleRemove }) => {
  return (
    <div className="flex items-center gap-2 rounded-full bg-primary px-3 py-1">
      <span className="text-sm font-medium">{data}</span>
      <button onClick={funHandleRemove} className="rounded-full p-1">
        <X size={16} />
      </button>
    </div>
  )
}

export default UserChip
