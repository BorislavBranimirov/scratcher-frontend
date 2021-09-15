import { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
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
import { generateUserPath } from '../../common/routePaths';
import { pushNotification } from '../notification/notificationSlice';

const UserPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectTimelineUser);
  const isLoading = useAppSelector(selectTimelineIsLoading);
  const isLogged = useAppSelector(selectAuthIsLogged);

  const { username, tab } = useParams<{ username: string; tab?: 'likes' }>();
  const history = useHistory();
  const userPath = generateUserPath({ username });
  const userLikesPath = generateUserPath({ username, tab: 'likes' });

  useEffect(() => {
    // prevent navigation to likes tab if user is not authenticated
    let unblock = history.block((nextLocation) => {
      if (nextLocation.pathname === userLikesPath && !isLogged) {
        dispatch(pushNotification('Log in to see user likes.'));
        return false;
      }
    });

    return () => {
      unblock();
    };
  }, [isLogged, history, userLikesPath, dispatch]);

  useEffect(() => {
    if (!tab) {
      dispatch(loadUserTimeline({ username }));
    }
    if (tab === 'likes') {
      if (isLogged) {
        dispatch(loadUserLikes({ username }));
      } else {
        history.replace(userPath);
      }
    }
  }, [tab, username, userPath, isLogged, history, dispatch]);

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
          history.goBack();
        }}
      >
        {'<-'}
      </button>
      <span>{username}</span>
      <UserProfile />
      <SuggestedUsersWindow />
      <NavLink to={userPath}>scratches</NavLink> {' | '}
      <NavLink to={userLikesPath}>likes</NavLink>
      {!tab && <UserPosts />}
      {tab === 'likes' && <UserLikes />}
    </div>
  );
};

export default UserPage;
