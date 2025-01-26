import React, { useState } from 'react'

const NewGroupContactCard = ({ data, funHandleSelect }) => {
  return (
    <>
      <label className="btn my-1 flex h-auto items-center justify-between gap-1 hover:bg-primary/10">
        <div className="h-auto rounded-sm">
          <div className="avatar">
            <div className="m-1 h-12 w-12 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="font-bold">{`${data.name}`}</p>
          <p className="text-sm font-light">Jai Shree Ram</p>
        </div>
        <input
          type="checkbox"
          checked={data.selected}
          className="checkbox-primary checkbox checkbox-sm transition-none checked:animate-none"
          onChange={() => funHandleSelect()}
        />
      </label>
    </>
  )
}

export default NewGroupContactCard
