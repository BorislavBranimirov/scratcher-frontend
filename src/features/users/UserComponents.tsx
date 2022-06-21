import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { generateUserPathWithTab } from '../../common/routePaths';
import { selectAuthUser } from '../auth/authSlice';
import { pushNotification } from '../notification/notificationSlice';
import { followUser, unfollowUser } from './usersSlice';

export const FollowButton = ({
  userId,
  isFollowing,
  textSize = 'xs',
}: {
  userId: number;
  isFollowing: boolean;
  textSize?: 'xs' | 'sm' | 'base';
}) => {
  const dispatch = useAppDispatch();
  const [followBtnHover, setFollowBtnHover] = useState(false);

  return isFollowing ? (
    <button
      onMouseEnter={() => {
        setFollowBtnHover(true);
      }}
      onMouseLeave={() => {
        setFollowBtnHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(unfollowUser({ id: userId }));
      }}
      className={`${
        followBtnHover
          ? 'bg-red hover:bg-red/80 active:bg-red/60'
          : 'bg-blue hover:bg-blue/80 active:bg-blue/60'
      } text-${textSize} rounded-full py-1.5 px-4 font-bold transition-colors`}
    >
      {followBtnHover ? 'Unfollow' : 'Following'}
    </button>
  ) : (
    <button
      onClick={(e) => {
        e.stopPropagation();
        dispatch(followUser({ id: userId }));
      }}
      className={`bg-blue text-${textSize} rounded-full py-1.5 px-4 font-bold transition-colors hover:bg-blue/80 active:bg-blue/60`}
    >
      Follow
    </button>
  );
};

export const UserFollowerCounters = ({
  username,
  followedCount,
  followerCount,
}: {
  username: string;
  followedCount: number;
  followerCount: number;
}) => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectAuthUser);

  const userFollowersPath = generateUserPathWithTab({
    username: username,
    tab: 'followers',
  });
  const userFollowingPath = generateUserPathWithTab({
    username: username,
    tab: 'following',
  });

  return (
    <div className="flex gap-3 text-sm">
      <Link
        className="hover:underline"
        to={userFollowingPath}
        onClick={(e) => {
          if (!loggedUser) {
            e.preventDefault();
            dispatch(pushNotification('Log in to see user followers.'));
          }
        }}
      >
        <span className="font-bold">{followedCount}</span>{' '}
        <span className="text-secondary">Following</span>
      </Link>
      <Link
        className="hover:underline"
        to={userFollowersPath}
        onClick={(e) => {
          if (!loggedUser) {
            e.preventDefault();
            dispatch(pushNotification('Log in to see user followers.'));
          }
        }}
      >
        <span className="font-bold">{followerCount}</span>{' '}
        <span className="text-secondary">Followers</span>
      </Link>
    </div>
  );
};
