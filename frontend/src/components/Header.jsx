import { useAppStore } from '@/store'
import { CircleUserRound } from 'lucide-react'
import React from 'react'

const Header = () => {
  const { logout } = useAppStore()
  return (
    <>
      <div className="col-span-12 row-span-1 flex items-center justify-between border-b-2 border-b-neutral p-4 text-primary">
        <h1 className="text-lg font-bold">GupShup</h1>
        <div className="p-2 hover:cursor-pointer" onClick={() => logout()}>
          <CircleUserRound size={28} />
        </div>
      </div>
    </>
  )
}

export default Header
