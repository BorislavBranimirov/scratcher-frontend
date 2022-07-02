import { ArrowLeft, Loader } from 'react-feather';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  loadUserFollowers,
  loadUserFollowing,
  loadUserLikes,
  loadUserMediaScratches,
  loadUserTimeline,
  selectTimelineIsLoading,
  selectTimelineUser,
} from '../timeline/timelineSlice';
import UserProfile from './UserProfile';
import { selectAuthIsLogged } from '../auth/authSlice';
import { generateUserPath, userPageTabValue } from '../../common/routePaths';
import UserPageTabs from './UserPageTabs';
import UserPagePosts from './UserPagePosts';
import FollowersList from './FollowersList';
import PageLayout from '../../common/PageLayout';

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
    } else if (!isLogged) {
      navigate(userPath, { replace: true });
    } else if (tab === 'media') {
      dispatch(loadUserMediaScratches({ username }));
    } else if (tab === 'likes') {
      dispatch(loadUserLikes({ username }));
    } else if (tab === 'followers') {
      dispatch(loadUserFollowers({ username }));
    } else if (tab === 'following') {
      dispatch(loadUserFollowing({ username }));
    }
  }, [tab, username, userPath, isLogged, navigate, dispatch]);

  if (isLoading) {
    return (
      <PageLayout>
        <Loader size={32} className="animate-spin-slow w-full mx-auto mt-10" />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="sticky top-0 bg-primary border-b border-primary px-4 py-1 z-10 flex items-center">
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
            <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors hover:bg-hover-2 active:bg-hover-3"></div>
            <ArrowLeft size={16} />
          </div>
        </button>
        {user ? (
          <div>
            <h2 className="text-lg font-bold leading-6">{user.name}</h2>
            <p className="pb-1 text-xs text-muted">@{user.username}</p>
          </div>
        ) : (
          <h2 className="py-2 text-lg font-bold leading-6">Profile</h2>
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
          <p className="text-sm text-muted">Try searching for another.</p>
        </div>
      )}
    </PageLayout>
  );
};

export default UserPage;
