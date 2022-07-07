import { NavLink, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  generateUserPath,
  generateUserPathWithTab,
  userPageTabValue,
} from '../../common/routePaths';
import { selectAuthIsLogged } from '../auth/authSlice';
import { pushNotification } from '../notification/notificationSlice';

const UserPageTabs = () => {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector(selectAuthIsLogged);
  const { username, userTab } = useParams() as {
    username: string;
    userTab?: userPageTabValue;
  };
  const userPath = generateUserPath({ username });
  const userMediaPath = generateUserPathWithTab({ username, userTab: 'media' });
  const userLikesPath = generateUserPathWithTab({ username, userTab: 'likes' });
  const userFollowersPath = generateUserPathWithTab({
    username,
    userTab: 'followers',
  });
  const userFollowingPath = generateUserPathWithTab({
    username,
    userTab: 'following',
  });

  if (userTab === 'followers' || userTab === 'following') {
    return (
      <div className="flex border-b border-primary">
        <div
          className={`grow flex justify-center transition-colors ${
            userTab === 'followers' ? 'hover:bg-hover-2' : 'hover:bg-hover-1'
          }`}
        >
          <NavLink
            className={({ isActive }) =>
              `px-4 text-center w-full ${isActive ? 'font-bold' : 'text-muted'}`
            }
            to={userFollowersPath}
            end
          >
            <div className="relative py-3 w-fit mx-auto">
              <span>Followers</span>
              {userTab === 'followers' && (
                <div className="absolute bottom-0 h-1 rounded-sm w-full bg-accent"></div>
              )}
            </div>
          </NavLink>
        </div>
        <div
          className={`grow flex justify-center transition-colors ${
            userTab === 'following' ? 'hover:bg-hover-2' : 'hover:bg-hover-1'
          }`}
        >
          <NavLink
            className={({ isActive }) =>
              `px-4 text-center w-full ${isActive ? 'font-bold' : 'text-muted'}`
            }
            to={userFollowingPath}
            end
          >
            <div className="relative py-3 w-fit mx-auto">
              <span>Following</span>
              {userTab === 'following' && (
                <div className="absolute bottom-0 h-1 rounded-sm w-full bg-accent"></div>
              )}
            </div>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex border-b border-primary">
      <div
        className={`grow flex justify-center transition-colors ${
          !userTab ? 'hover:bg-hover-2' : 'hover:bg-hover-1'
        }`}
      >
        <NavLink
          className={({ isActive }) =>
            `px-4 text-center w-full ${isActive ? 'font-bold' : 'text-muted'}`
          }
          to={userPath}
          end
        >
          <div className="relative py-3 w-fit mx-auto">
            <span>Scratches</span>
            {!userTab && (
              <div className="absolute bottom-0 h-1 rounded-sm w-full bg-accent"></div>
            )}
          </div>
        </NavLink>
      </div>
      <div
        className={`grow flex justify-center transition-colors ${
          userTab === 'media' ? 'hover:bg-hover-2' : 'hover:bg-hover-1'
        }`}
      >
        <NavLink
          className={({ isActive }) =>
            `px-4 text-center w-full ${isActive ? 'font-bold' : 'text-muted'}`
          }
          to={userMediaPath}
          end
          onClick={(e) => {
            if (!isLogged) {
              e.preventDefault();
              dispatch(pushNotification('Log in to see user media.'));
            }
          }}
        >
          <div className="relative py-3 w-fit mx-auto">
            <span>Media</span>
            {userTab === 'media' && (
              <div className="absolute bottom-0 h-1 rounded-sm w-full bg-accent"></div>
            )}
          </div>
        </NavLink>
      </div>
      <div
        className={`grow flex justify-center transition-colors ${
          userTab === 'likes' ? 'hover:bg-hover-2' : 'hover:bg-hover-1'
        }`}
      >
        <NavLink
          className={({ isActive }) =>
            `px-4 text-center w-full ${isActive ? 'font-bold' : 'text-muted'}`
          }
          to={userLikesPath}
          end
          onClick={(e) => {
            if (!isLogged) {
              e.preventDefault();
              dispatch(pushNotification('Log in to see user likes.'));
            }
          }}
        >
          <div className="relative py-3 w-fit mx-auto">
            <span>Likes</span>
            {userTab === 'likes' && (
              <div className="absolute bottom-0 h-1 rounded-sm w-full bg-accent"></div>
            )}
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default UserPageTabs;
