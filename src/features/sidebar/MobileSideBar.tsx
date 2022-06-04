import { useEffect, useState } from 'react';
import {
  Bookmark,
  Home,
  LogIn,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from 'react-feather';
import avatar from '../../images/avatarplaceholder.png';
import { useLocation } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectAuthUser } from '../auth/authSlice';
import { generateUserPath } from '../../common/routePaths';

const MobileSideBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const location = useLocation();
  const [openSideBar, setOpenSideBar] = useState(window.innerWidth >= 640);

  useEffect(() => {
    setOpenSideBar(false);
  }, [location]);

  if (!openSideBar) {
    return (
      <button
        className="sm:hidden fixed w-10 h-10 rounded-full bg-blue top-3 right-3 z-30"
        onClick={() => {
          setOpenSideBar(true);
        }}
      >
        <Menu className="mx-auto" />
      </button>
    );
  }

  return (
    <>
      <div
        className="sm:hidden fixed w-screen h-screen bg-primary/10 z-30"
        onClick={() => {
          setOpenSideBar(false);
        }}
      ></div>
      <header className="sm:hidden fixed w-3/5 h-screen bg-neutral z-40">
        <div className="flex flex-col">
          {user ? (
            <>
              <div className="border-b border-primary p-3 flex justify-between">
                <p className="font-bold">Account info</p>
                <button
                  className="relative"
                  onClick={() => {
                    setOpenSideBar(false);
                  }}
                  title="Close"
                >
                  <div className="absolute top-0 left-0 right-0 bottom-0 -m-1.5 rounded-full transition-colors hover:bg-primary/5 active:bg-opacity-20"></div>
                  <X />
                </button>
              </div>
              <Link
                className="border-b border-primary flex flex-col p-3 gap-1 min-w-0"
                to={generateUserPath({ username: user.username })}
              >
                <img
                  src={user.profileImageUrl || avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                />
                <div>
                  <p className="truncate">{user?.name}</p>
                  <p className="text-secondary text-sm truncate">
                    @{user?.username}
                  </p>
                </div>
              </Link>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-primary/5 ${
                    isActive && 'font-bold stroke-3'
                  }`
                }
                to="/home"
              >
                <Home strokeWidth={undefined} />
                <span>Home</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-primary/5 ${
                    isActive && 'font-bold stroke-3'
                  }`
                }
                to="/bookmarks"
              >
                <Bookmark strokeWidth={undefined} />
                <span>Bookmarks</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-primary/5 ${
                    isActive && 'font-bold stroke-3'
                  }`
                }
                to={generateUserPath({ username: user.username })}
              >
                <User strokeWidth={undefined} />
                <span>Profile</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-primary/5 ${
                    isActive && 'font-bold stroke-3'
                  }`
                }
                to="/settings"
              >
                <Settings strokeWidth={undefined} />
                <span>Settings</span>
              </NavLink>
              <button
                className="border-t border-primary flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-primary/5"
                onClick={() => {
                  dispatch(logout());
                }}
              >
                <LogOut />
                Log out
              </button>
            </>
          ) : (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 stroke-2 p-3 transition-colors hover:bg-primary/5 ${
                  isActive && 'font-bold stroke-3'
                }`
              }
              to="/login"
            >
              <LogIn strokeWidth={undefined} />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </header>
    </>
  );
};

export default MobileSideBar;
