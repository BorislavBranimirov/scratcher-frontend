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
  const { username, tab } = useParams() as {
    username: string;
    tab?: userPageTabValue;
  };
  const userPath = generateUserPath({ username });
  const userLikesPath = generateUserPathWithTab({ username, tab: 'likes' });

  return (
    <div className="flex border-b border-primary">
      <div
        className={`grow flex justify-center transition-colors ${
          !tab ? 'hover:bg-primary/10' : 'hover:bg-primary/5'
        }`}
      >
        <NavLink
          className={({ isActive }) =>
            `px-4 text-center w-full ${
              isActive ? 'font-bold' : 'text-secondary'
            }`
          }
          to={userPath}
          end
        >
          <div className="relative py-3 w-fit mx-auto">
            <span>Scratches</span>
            {!tab && (
              <div className="absolute bottom-0 h-1 rounded-sm w-full bg-blue"></div>
            )}
          </div>
        </NavLink>
      </div>
      <div
        className={`grow flex justify-center transition-colors ${
          tab === 'likes' ? 'hover:bg-primary/10' : 'hover:bg-primary/5'
        }`}
      >
        <NavLink
          className={({ isActive }) =>
            `px-4 text-center w-full ${
              isActive ? 'font-bold' : 'text-secondary'
            }`
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
            {tab === 'likes' && (
              <div className="absolute bottom-0 h-1 rounded-sm w-full bg-blue"></div>
            )}
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default UserPageTabs;
