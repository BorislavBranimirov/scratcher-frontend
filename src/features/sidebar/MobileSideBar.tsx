import { useEffect, useState } from 'react';
import {
  Bookmark,
  Feather,
  Hash,
  Home,
  LogIn,
  LogOut,
  Menu,
  Settings,
  Share2,
  User,
  UserPlus,
  X,
} from 'react-feather';
import { useLocation } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectAuthUser } from '../auth/authSlice';
import { generateSearchPath, generateUserPath } from '../../common/routePaths';
import { openPostModal } from '../modal/modalSlice';
import { getProfileImageUrl } from '../../common/profileImageUrls';
import logo from '../../images/logo.png';

const MobileSideBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const location = useLocation();
  const [openSideBar, setOpenSideBar] = useState(false);
  const searchScratchesPath = generateSearchPath({ searchTab: 'scratches' });

  useEffect(() => {
    setOpenSideBar(false);
  }, [location]);

  if (!openSideBar) {
    return (
      <button
        className="sm:hidden fixed w-10 h-10 rounded-full bg-accent text-accent-inverted shadow top-3 right-3 z-30"
        data-cy="mobile-sidebar-btn"
        onClick={() => {
          setOpenSideBar(true);
        }}
      >
        <Menu className="mx-auto" />
      </button>
    );
  }

  const profileImageUrl = getProfileImageUrl(user?.profileImageUrl);

  return (
    <>
      <div
        className="sm:hidden fixed w-screen h-screen bg-hover-2 z-30"
        onClick={() => {
          setOpenSideBar(false);
        }}
      ></div>
      <header
        className="sm:hidden fixed w-3/4 h-screen bg-primary z-40 overflow-auto"
        data-cy="mobile-sidebar"
      >
        <div className="flex flex-col">
          {user ? (
            <>
              <div className="border-b border-primary p-3 flex justify-between">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="logo" className="w-6 h-6" />
                  <p className="font-bold">Account info</p>
                </div>
                <button
                  className="relative"
                  onClick={() => {
                    setOpenSideBar(false);
                  }}
                  title="Close"
                >
                  <div className="absolute inset-0 -m-1.5 rounded-full transition-colors hover:bg-hover-1 active:bg-hover-3"></div>
                  <X />
                </button>
              </div>
              <Link
                className="border-b border-primary flex flex-col p-3 gap-1 min-w-0"
                to={generateUserPath({ username: user.username })}
              >
                <img
                  src={profileImageUrl}
                  alt="avatar"
                  className="w-9 h-9 rounded-full overflow-hidden shrink-0"
                />
                <div>
                  <p className="truncate">{user.name}</p>
                  <p className="text-sm text-muted truncate">
                    @{user.username}
                  </p>
                </div>
              </Link>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to="/home"
              >
                <Home strokeWidth={undefined} />
                <span>Home</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to={searchScratchesPath}
              >
                <Hash strokeWidth={undefined} />
                <span>Explore</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to={'/suggested-users'}
              >
                <Share2 strokeWidth={undefined} />
                <span>Connect</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to="/bookmarks"
              >
                <Bookmark strokeWidth={undefined} />
                <span>Bookmarks</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to={generateUserPath({ username: user.username })}
                end
              >
                <User strokeWidth={undefined} />
                <span>Profile</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to="/settings"
              >
                <Settings strokeWidth={undefined} />
                <span>Settings</span>
              </NavLink>
              <button
                className="mx-auto w-[90%] bg-accent rounded-full my-2 p-3 font-bold text-accent-inverted transition-colors hover:bg-accent/80 active:bg-accent/60"
                onClick={() => {
                  setOpenSideBar(false);
                  dispatch(openPostModal());
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Feather />
                  <span>Scratch</span>
                </div>
              </button>
              <button
                className="border-t border-primary flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1"
                data-cy="sidebar-log-out-btn"
                onClick={() => {
                  dispatch(logout());
                }}
              >
                <LogOut />
                Log out
              </button>
            </>
          ) : (
            <>
              <div className="border-b border-primary p-3 flex justify-between">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="logo" className="w-6 h-6" />
                  <p className="font-bold">Not logged in</p>
                </div>
                <button
                  className="relative"
                  onClick={() => {
                    setOpenSideBar(false);
                  }}
                  title="Close"
                >
                  <div className="absolute inset-0 -m-1.5 rounded-full transition-colors hover:bg-hover-1 active:bg-hover-3"></div>
                  <X />
                </button>
              </div>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to="/login"
              >
                <LogIn strokeWidth={undefined} />
                <span>Login</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to="/signup"
              >
                <UserPlus strokeWidth={undefined} />
                <span>Sign up</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to={searchScratchesPath}
              >
                <Hash strokeWidth={undefined} />
                <span>Explore</span>
              </NavLink>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default MobileSideBar;
