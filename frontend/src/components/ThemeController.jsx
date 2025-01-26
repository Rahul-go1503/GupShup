import { useAppStore } from '@/store'
import { themes } from '@/utils/themes'
import React from 'react'
import { ScrollArea } from './ui/scroll-area'

const ThemeController = () => {
  const { setTheme } = useAppStore()
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] w-52 rounded-box bg-base-300 p-2 shadow-2xl"
        onChange={(e) => setTheme(e.target.value)}
      >
        <ScrollArea className="h-96">
          {themes.map((theme, index) => (
            <li key={index}>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-ghost btn-sm btn-block justify-start"
                aria-label={theme}
                value={theme}
              />
            </li>
          ))}
        </ScrollArea>
      </ul>
    </div>
  )
}

export default ThemeController
