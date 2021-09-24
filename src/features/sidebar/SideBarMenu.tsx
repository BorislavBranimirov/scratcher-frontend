import { NavLink, useHistory } from 'react-router-dom';
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

const SideBarMenu = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const history = useHistory();

  const [toggle, setToggle] = useState(false);

  return (
    <header className="col-start-2 col-end-4 flex justify-end">
      <div className="fixed h-screen flex flex-col justify-between pr-3 py-3 lg:w-1/6 z-20">
        <div className="flex flex-col items-center lg:items-start">
          <p className="font-bold text-xl hidden lg:block p-3 rounded-full transition-colors hover:bg-primary hover:bg-opacity-5">Scratcher</p>
          {user ? (
            <>
              <NavLink
                className="flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary hover:bg-opacity-5"
                to="/home"
                activeClassName="font-bold stroke-3"
              >
                <Home strokeWidth={undefined} />
                <span className="hidden lg:block">Home</span>
              </NavLink>
              <NavLink
                className="flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary hover:bg-opacity-5"
                to="/bookmarks"
                activeClassName="font-bold stroke-4"
              >
                <Bookmark strokeWidth={undefined} />
                <span className="hidden lg:block">Bookmarks</span>
              </NavLink>
              <NavLink
                className="flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary hover:bg-opacity-5"
                to={generateUserPath({ username: user.username })}
                activeClassName="font-bold stroke-4"
              >
                <User strokeWidth={undefined} />
                <span className="hidden lg:block">Profile</span>
              </NavLink>
              <NavLink
                className="flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary hover:bg-opacity-5"
                to="/settings"
                activeClassName="font-bold stroke-3"
              >
                <Settings strokeWidth={undefined} />
                <span className="hidden lg:block">Settings</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                className="flex items-center gap-3 text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary hover:bg-opacity-5"
                to="/login"
                activeClassName="font-bold stroke-3"
              >
                <LogIn strokeWidth={undefined} />
                <span className="hidden lg:block">Login</span>
              </NavLink>
            </>
          )}
          <NavLink to="/user/testUser1" className="hidden lg:block text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary hover:bg-opacity-5">
            testUser1
          </NavLink>
          <NavLink to="/user/testUser2" className="hidden lg:block text-lg stroke-2 p-3 rounded-full transition-colors hover:bg-primary hover:bg-opacity-5">
            testUser2
          </NavLink>
        </div>
        {user && (
          <div>
            <div className="relative">
              <div
                className={`fixed top-0 right-0 bottom-0 left-0 cursor-auto ${
                  !toggle && 'hidden'
                }`}
                onClick={() => {
                  setToggle(false);
                }}
              ></div>
              <div
                className={`absolute bottom-0 right-0 bg-neutral flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
                  !toggle && 'hidden'
                }`}
              >
                <button
                  className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary hover:bg-opacity-5 flex items-center gap-3"
                  onClick={() => {
                    history.push(generateUserPath({ username: user.username }));
                    setToggle(false);
                  }}
                >
                  <User size={16} />
                  View profile
                </button>
                <button
                  className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary hover:bg-opacity-5 flex items-center gap-3"
                  onClick={() => {
                    dispatch(logout());
                    setToggle(false);
                  }}
                >
                  <LogOut size={16} />
                  Log out @{user.username}
                </button>
              </div>
            </div>
            <div
              className="flex items-center justify-between py-2.5 px-3 rounded-full cursor-pointer bg-neutral transition-colors hover:bg-primary hover:bg-opacity-5 active:bg-opacity-10"
              onClick={() => {
                setToggle(true);
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={user.profileImageUrl || avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                />
                <div className="overflow-hidden leading-5 hidden lg:block">
                  <p className="truncate">{user?.name}</p>
                  <p className="text-secondary text-sm truncate">
                    @{user?.username}
                  </p>
                </div>
              </div>
              <MoreHorizontal
                size={16}
                className="ml-3 flex-shrink-0 hidden lg:block"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default SideBarMenu;
