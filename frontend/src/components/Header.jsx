import { useAppStore } from '@/store'
import { CircleUserRound } from 'lucide-react'
import React from 'react'

const Header = () => {
  const { logout } = useAppStore()
  return (
    <>
      <div className="col-span-12 row-span-1 flex items-center justify-between border-b-2 border-b-neutral p-4 text-primary">
        <h1 className="text-lg font-bold">GupShup</h1>
        <div className="dropdown dropdown-left">
          <div tabIndex={0} role="button" className="m-1">
            <div className="text-primary">
              <CircleUserRound size={28} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] flex flex-col gap-2 rounded-box bg-base-200 p-2 shadow"
          >
            <li>
              <a>Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li onClick={() => logout()}>
              <a>logout</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Header
