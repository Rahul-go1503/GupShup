import { useAppStore } from '@/store'
import { AudioWaveform } from 'lucide-react'
import ThemeController from './ThemeController'
import EditProfileSection from './EditProfile'
import BrandLogo from './ui/BrandLogo'

const Header = () => {
  const { userInfo, logout, selectedUserData } = useAppStore()
  return (
    <>
      <div
        className={`${selectedUserData ? 'hidden md:flex' : 'flex'} h-[10%] items-center justify-between border-b-2 border-b-neutral bg-base-100 px-2`}
      >
        <BrandLogo />
        <div className="my-2 flex items-center gap-2">
          <ThemeController />
          <div className="dropdown dropdown-left dropdown-bottom">
            <div tabIndex={0} role="button" className="m-1">
              <div className="avatar">
                <div className="mask mask-squircle h-8 w-8">
                  <img
                    src={
                      userInfo?.profile ||
                      'https://ui-avatars.com/api/?name=' +
                        userInfo?.firstName.split(' ').join('+') +
                        '&background=random&color=fff'
                    }
                    alt={userInfo?.firstName}
                  />
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] w-52 rounded-box bg-base-300 p-2 shadow-2xl"
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
