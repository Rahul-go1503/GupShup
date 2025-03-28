import { useAppStore } from '@/store'
import { themes } from '@/utils/themes'
import { ScrollArea } from './ui/scroll-area'
import { ChevronDown } from 'lucide-react'

const ThemeController = () => {
  const { theme, setTheme } = useAppStore()

  const themeHandler = (e) => {
    setTheme(e.target.value)
    localStorage.setItem('theme', e.target.value)
  }
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="flex items-center gap-1 font-semibold"
      >
        <p>Theme</p>
        <ChevronDown size={16} />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] w-52 rounded-box bg-base-300 p-2 shadow-2xl"
        onChange={(e) => themeHandler(e)}
      >
        <ScrollArea className="h-96">
          {themes.map((th, index) => (
            <li key={index}>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-ghost btn-sm btn-block justify-start text-base-content"
                aria-label={th}
                value={th}
                defaultChecked={theme === th}
              />
            </li>
          ))}
        </ScrollArea>
      </ul>
    </div>
  )
}

export default ThemeController
