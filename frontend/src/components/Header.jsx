import { CircleUserRound } from 'lucide-react'
import React from 'react'

const Header = () => {
  return (
    <>
      <div className="col-span-12 row-span-1 flex items-center justify-between border-b-2 border-b-neutral p-4 text-primary">
        <h1 className="text-lg font-bold">GupShup</h1>
        <div className="p-2">
          <CircleUserRound size={28} />
        </div>
      </div>
      {/* <div className='bg-primary'>Primary</div>
    <div className='bg-secondary'>secondary</div>
    <div className='bg-accent'>accent</div>
    <div className='bg-neutral'>Neutral</div>
    <div className='bg-base-100'>base</div>
    <div className='bg-primary'>Primary</div> */}
    </>
  )
}

export default Header
