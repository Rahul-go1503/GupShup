import { AudioWaveform } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const BrandLogo = ({ className }) => {
  return (
    <>
      <div
        className={`flex items-center justify-start gap-2 text-primary ${className}`}
      >
        <div className="rounded-full p-1 ring-1 ring-inset ring-primary">
          <AudioWaveform size={20} />
        </div>
        <h1 className="text-2xl font-bold">
          <Link to="/">GupShup</Link>
        </h1>
      </div>
    </>
  )
}

export default BrandLogo
