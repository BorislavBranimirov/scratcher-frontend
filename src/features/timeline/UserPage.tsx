import { useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  loadUserLikes,
  loadUserTimeline,
  selectTimelineIsLoading,
  selectTimelineUser,
} from '../timeline/timelineSlice';
import SuggestedUsersWindow from '../suggestedUsers/SuggestedUsersWindow';
import UserPosts from './UserPosts';
import UserProfile from './UserProfile';
import UserLikes from './UserLikes';
import { selectAuthIsLogged } from '../auth/authSlice';
import {
  generateUserPath,
  generateUserPathWithTab,
  userPageTabValue,
} from '../../common/routePaths';
import { pushNotification } from '../notification/notificationSlice';

const UserPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectTimelineUser);
  const isLoading = useAppSelector(selectTimelineIsLoading);
  const isLogged = useAppSelector(selectAuthIsLogged);

  const { username, tab } = useParams() as {
    username: string;
    tab?: userPageTabValue;
  };
  const navigate = useNavigate();
  const userPath = generateUserPath({ username });
  const userLikesPath = generateUserPathWithTab({ username, tab: 'likes' });

  useEffect(() => {
    if (!tab) {
      dispatch(loadUserTimeline({ username }));
    }
    if (tab === 'likes') {
      if (isLogged) {
        dispatch(loadUserLikes({ username }));
      } else {
        navigate(userPath, { replace: true });
      }
    }
  }, [tab, username, userPath, isLogged, navigate, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        {'<-'}
      </button>
      <span>{username}</span>
      <UserProfile />
      <SuggestedUsersWindow />
      <NavLink to={userPath}>scratches</NavLink> {' | '}
      <NavLink
        to={userLikesPath}
        onClick={(e) => {
          if (!isLogged) {
            e.preventDefault();
            dispatch(pushNotification('Log in to see user likes.'));
          }
        }}
      >
        likes
      </NavLink>
      {!tab && <UserPosts />}
      {tab === 'likes' && <UserLikes />}
    </div>
  );
};

export default UserPage;
