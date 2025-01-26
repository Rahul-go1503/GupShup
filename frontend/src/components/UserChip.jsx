import { X } from 'lucide-react'
import React from 'react'

const UserChip = ({ data, funHandleRemove }) => {
  return (
    <div className="badge badge-lg flex min-h-3 items-center justify-center gap-1 bg-primary">
      <span>{data}</span>
      <span onClick={funHandleRemove}>
        <X size={16} />
      </span>
    </div>
  )
}

export default UserChip
