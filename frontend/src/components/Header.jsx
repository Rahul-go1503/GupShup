import { useAppStore } from '@/store'
import { CircleUserRound } from 'lucide-react'
import ThemeController from './ThemeController'
import EditProfileSection from './EditProfile'

const Header = () => {
  const { userInfo, logout } = useAppStore()
  return (
    <>
      <div className="col-span-12 row-span-1 flex items-center justify-between border-b-2 border-b-neutral px-2 text-primary">
        <h1 className="text-lg font-bold">GupShup</h1>
        <div className="my-2 flex items-center gap-1">
          <ThemeController />
          <div className="dropdown dropdown-left">
            <div tabIndex={0} role="button" className="m-1">
              <div className="avatar">
                <div className="mask mask-squircle h-8 w-8">
                  <img
                    src={
                      userInfo.profile ||
                      'https://ui-avatars.com/api/?name=' +
                        userInfo.firstName.split(' ').join('+') +
                        '&background=random&color=fff'
                    }
                    alt={userInfo.firstName}
                  />
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] flex flex-col gap-2 rounded-box bg-base-200 p-2 shadow"
            >
              <li
                onClick={() =>
                  document.getElementById('profile_modal').showModal()
                }
              >
                <a>Profile</a>
              </li>
              <li onClick={() => logout()}>
                <a>logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <EditProfileSection />
    </>
  )
}

export default Header
