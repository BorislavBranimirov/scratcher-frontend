import { ArrowLeft, Loader } from 'react-feather';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  loadUserFollowers,
  loadUserFollowing,
  loadUserLikes,
  loadUserTimeline,
  selectTimelineIsLoading,
  selectTimelineUser,
} from '../timeline/timelineSlice';
import SuggestedUsersWindow from '../suggestedUsers/SuggestedUsersWindow';
import UserProfile from './UserProfile';
import { selectAuthIsLogged } from '../auth/authSlice';
import { generateUserPath, userPageTabValue } from '../../common/routePaths';
import UserPageTabs from './UserPageTabs';
import UserPagePosts from './UserPagePosts';
import FollowersList from './FollowersList';

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
    if (tab === 'followers') {
      if (isLogged) {
        dispatch(loadUserFollowers({ username }));
      } else {
        navigate(userPath, { replace: true });
      }
    }
    if (tab === 'following') {
      if (isLogged) {
        dispatch(loadUserFollowing({ username }));
      } else {
        navigate(userPath, { replace: true });
      }
    }
  }, [tab, username, userPath, isLogged, navigate, dispatch]);

  if (isLoading) {
    return (
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        <Loader size={32} className="animate-spin-slow w-full mx-auto mt-10" />
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        <div className="sticky top-0 bg-neutral border-b border-primary px-4 py-3 z-10 flex items-center">
          <button
            className="h-full mr-4"
            onClick={() => {
              if (!tab) {
                navigate(-1);
              } else {
                navigate(userPath);
              }
            }}
          >
            <div className="relative" title="Back">
              <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors hover:bg-primary/10 active:bg-primary/20"></div>
              <ArrowLeft size={16} />
            </div>
          </button>
          {user ? (
            <h2 className="text-lg font-bold leading-6">{user.name}</h2>
          ) : (
            <h2 className="text-lg font-bold leading-6">Profile</h2>
          )}
        </div>
        {user ? (
          <>
            {!(tab === 'followers' || tab === 'following') && <UserProfile />}
            <UserPageTabs />
            {tab === 'followers' || tab === 'following' ? (
              <FollowersList />
            ) : (
              <UserPagePosts />
            )}
          </>
        ) : (
          <div className="mt-4 text-center">
            <h2 className="text-lg font-bold">This account doesn't exist</h2>
            <p className="text-sm text-secondary">Try searching for another.</p>
          </div>
        )}
      </div>
      <div className="hidden lg:block lg:ml-6 lg:col-span-3 lg:mr-12 xl:mr-0">
        <SuggestedUsersWindow />
      </div>
    </>
  );
};

export default UserPage;
