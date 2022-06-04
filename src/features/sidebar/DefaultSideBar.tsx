import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
import { logout } from '../auth/authSlice';
import { generateUserPath } from '../../common/routePaths';
import {
  Bookmark,
  Home,
  LogIn,
  LogOut,
  MoreHorizontal,
  Settings,
  User,
} from 'react-feather';
import avatar from '../../images/avatarplaceholder.png';
import { useState } from 'react';

const DefaultSideBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const navigate = useNavigate();

  const [userOptionsToggle, setUserOptionsToggle] = useState(false);

  return (
    <header className="hidden col-span-1 md:col-start-2 lg:col-start-1 xl:col-start-2 xl:col-span-2 sm:flex justify-end">
      <div className="fixed h-screen flex flex-col justify-between pr-3 py-3 xl:w-1/6 z-20">
        <div className="flex flex-col items-center xl:items-start">
          <p className="font-bold text-xl hidden xl:block p-3 rounded-full transition-colors hover:bg-primary/5">
            Scratcher
          </p>
          {user ? (
            <>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary/5 ${
                    isActive && 'font-bold stroke-3'
                  }`
                }
                to="/home"
              >
                <Home strokeWidth={undefined} />
                <span className="hidden xl:block">Home</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary/5 ${
                    isActive && 'font-bold stroke-4'
                  }`
                }
                to="/bookmarks"
              >
                <Bookmark strokeWidth={undefined} />
                <span className="hidden xl:block">Bookmarks</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary/5 ${
                    isActive && 'font-bold stroke-4'
                  }`
                }
                to={generateUserPath({ username: user.username })}
              >
                <User strokeWidth={undefined} />
                <span className="hidden xl:block">Profile</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary/5 ${
                    isActive && 'font-bold stroke-3'
                  }`
                }
                to="/settings"
              >
                <Settings strokeWidth={undefined} />
                <span className="hidden xl:block">Settings</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary/5 ${
                    isActive && 'font-bold stroke-3'
                  }`
                }
                to="/login"
              >
                <LogIn strokeWidth={undefined} />
                <span className="hidden xl:block">Login</span>
              </NavLink>
            </>
          )}
          <NavLink
            to="/user/testUser1"
            className="hidden xl:block text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary/5"
          >
            testUser1
          </NavLink>
          <NavLink
            to="/user/testUser2"
            className="hidden xl:block text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary/5"
          >
            testUser2
          </NavLink>
        </div>
        {user && (
          <div>
            <div className="relative">
              <div
                className={`fixed top-0 right-0 bottom-0 left-0 cursor-auto ${
                  !userOptionsToggle && 'hidden'
                }`}
                onClick={() => {
                  setUserOptionsToggle(false);
                }}
              ></div>
              <div
                className={`absolute bottom-0 left-0 bg-neutral flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
                  !userOptionsToggle && 'hidden'
                }`}
              >
                <button
                  className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 flex items-center gap-3"
                  onClick={() => {
                    navigate(generateUserPath({ username: user.username }));
                    setUserOptionsToggle(false);
                  }}
                >
                  <User size={16} />
                  View profile
                </button>
                <button
                  className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 flex items-center gap-3"
                  onClick={() => {
                    dispatch(logout());
                    setUserOptionsToggle(false);
                  }}
                >
                  <LogOut size={16} />
                  Log out @{user.username}
                </button>
              </div>
            </div>
            <div
              className="flex items-center justify-between py-2.5 px-3 rounded-full cursor-pointer bg-neutral transition-colors hover:bg-primary/5 active:bg-opacity-10"
              onClick={() => {
                setUserOptionsToggle(true);
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={user.profileImageUrl || avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                />
                <div className="overflow-hidden leading-5 hidden xl:block">
                  <p className="truncate">{user?.name}</p>
                  <p className="text-secondary text-sm truncate">
                    @{user?.username}
                  </p>
                </div>
              </div>
              <MoreHorizontal
                size={16}
                className="ml-3 flex-shrink-0 hidden xl:block"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DefaultSideBar;
