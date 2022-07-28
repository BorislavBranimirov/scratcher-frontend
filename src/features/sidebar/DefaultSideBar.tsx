import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
import { logout } from '../auth/authSlice';
import { generateSearchPath, generateUserPath } from '../../common/routePaths';
import {
  Bookmark,
  Feather,
  Hash,
  Home,
  LogIn,
  LogOut,
  MoreHorizontal,
  Settings,
  User,
  UserPlus,
} from 'react-feather';
import { useState } from 'react';
import { openPostModal } from '../modal/modalSlice';
import { getProfileImageUrl } from '../../common/profileImageUrls';
import logo from '../../images/logo.png';

const DefaultSideBar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const navigate = useNavigate();

  const [userOptionsToggle, setUserOptionsToggle] = useState(false);
  const searchScratchesPath = generateSearchPath({ searchTab: 'scratches' });
  const profileImageUrl = getProfileImageUrl(user?.profileImageUrl);

  return (
    <header
      className="hidden col-span-1 md:col-start-2 lg:col-start-1 xl:col-start-2 xl:col-span-2 sm:flex justify-end"
      data-cy="desktop-sidebar"
    >
      <div className="sticky top-0 xl:w-full h-screen flex flex-col justify-between pr-3 py-3 z-20">
        <div className="flex flex-col items-center xl:items-start">
          <Link
            className="flex items-center gap-3 text-xl font-bold p-3 rounded-full transition-colors hover:bg-hover-1"
            to="/home"
          >
            <img src={logo} alt="logo" className="w-6 h-6" />
            <span className="hidden xl:block">Scratcher</span>
          </Link>
          {user ? (
            <>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to="/home"
              >
                <Home strokeWidth={undefined} />
                <span className="hidden xl:block">Home</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to={searchScratchesPath}
              >
                <Hash strokeWidth={undefined} />
                <span className="hidden xl:block">Explore</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-4' : ''
                  }`
                }
                to="/bookmarks"
              >
                <Bookmark strokeWidth={undefined} />
                <span className="hidden xl:block">Bookmarks</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-4' : ''
                  }`
                }
                to={generateUserPath({ username: user.username })}
                end
              >
                <User strokeWidth={undefined} />
                <span className="hidden xl:block">Profile</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to="/settings"
              >
                <Settings strokeWidth={undefined} />
                <span className="hidden xl:block">Settings</span>
              </NavLink>
              <button
                className="xl:w-[90%] bg-accent rounded-full mt-2 p-3 font-bold text-accent-inverted transition-colors hover:bg-accent/80 active:bg-accent/60"
                data-cy="sidebar-scratch-btn"
                onClick={() => {
                  dispatch(openPostModal());
                }}
              >
                <span className="hidden xl:block">Scratch</span>
                <span className="xl:hidden">
                  <Feather />
                </span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to="/login"
              >
                <LogIn strokeWidth={undefined} />
                <span className="hidden xl:block">Login</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to="/signup"
              >
                <UserPlus strokeWidth={undefined} />
                <span className="hidden xl:block">Sign up</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-hover-1 ${
                    isActive ? 'font-bold stroke-3' : ''
                  }`
                }
                to={searchScratchesPath}
              >
                <Hash strokeWidth={undefined} />
                <span className="hidden xl:block">Explore</span>
              </NavLink>
            </>
          )}
        </div>
        {user && (
          <div>
            <div className="relative">
              <div
                className={`fixed inset-0 cursor-auto ${
                  !userOptionsToggle ? 'hidden' : ''
                }`}
                onClick={() => {
                  setUserOptionsToggle(false);
                }}
              ></div>
              <div
                className={`absolute bottom-0 left-0 bg-primary flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
                  !userOptionsToggle ? 'hidden' : ''
                }`}
              >
                <button
                  className="whitespace-nowrap p-4 transition-colors hover:bg-hover-1 active:bg-hover-2 flex items-center gap-3"
                  onClick={() => {
                    navigate(generateUserPath({ username: user.username }));
                    setUserOptionsToggle(false);
                  }}
                >
                  <User size={16} />
                  View profile
                </button>
                <button
                  className="whitespace-nowrap p-4 transition-colors hover:bg-hover-1 active:bg-hover-2 flex items-center gap-3"
                  data-cy="sidebar-log-out-btn"
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
              className="flex items-center justify-between p-3 rounded-full cursor-pointer transition-colors hover:bg-hover-1 active:bg-hover-2"
              data-cy="sidebar-more-menu-btn"
              onClick={() => {
                setUserOptionsToggle(true);
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={profileImageUrl}
                  alt="avatar"
                  className="w-9 h-9 rounded-full overflow-hidden shrink-0"
                />
                <div className="overflow-hidden leading-5 hidden xl:block">
                  <p className="truncate">{user.name}</p>
                  <p className="text-sm text-muted truncate">
                    @{user.username}
                  </p>
                </div>
              </div>
              <MoreHorizontal
                size={16}
                className="ml-3 shrink-0 hidden xl:block"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DefaultSideBar;
