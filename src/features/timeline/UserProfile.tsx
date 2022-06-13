import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { Calendar } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
import { followUser, selectTimelineUser, unfollowUser } from './timelineSlice';
import avatar from '../../images/avatarplaceholder.png';
import banner from '../../images/bannerplaceholder.png';
import { Link } from 'react-router-dom';
import { generateUserPathWithTab } from '../../common/routePaths';
import { pushNotification } from '../notification/notificationSlice';

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectTimelineUser);
  const loggedUser = useAppSelector(selectAuthUser);

  const [followBtnHover, setFollowBtnHover] = useState(false);

  if (!user) {
    return <div>User not found</div>;
  }

  const joinedDate = parseISO(user.createdAt);

  const userFollowersPath = generateUserPathWithTab({
    username: user.username,
    tab: 'followers',
  });
  const userFollowingPath = generateUserPathWithTab({
    username: user.username,
    tab: 'following',
  });

  const followButton = user.isFollowing ? (
    <button
      className={`${
        followBtnHover
          ? 'bg-red hover:bg-red/80 active:bg-red/60'
          : 'bg-blue hover:bg-blue/80 active:bg-blue/60'
      } text-sm rounded-full py-1.5 px-4 font-bold transition-colors`}
      onMouseEnter={() => {
        setFollowBtnHover(true);
      }}
      onMouseLeave={() => {
        setFollowBtnHover(false);
      }}
      onClick={() => {
        dispatch(unfollowUser({ id: user.id }));
      }}
    >
      {followBtnHover ? 'Unfollow' : 'Following'}
    </button>
  ) : (
    <button
      className="bg-blue text-sm rounded-full py-1.5 px-4 font-bold transition-colors hover:bg-blue/80 active:bg-blue/60"
      onClick={() => {
        dispatch(followUser({ id: user.id }));
      }}
    >
      Follow
    </button>
  );

  return (
    <div>
      <img src={user.profileBannerUrl || banner} alt="banner" />
      <div className="pt-3 pb-2 px-4">
        <div className="flex justify-between items-start mb-2">
          <img
            className="w-1/5 rounded-full -mt-[12%] border-4 border-neutral"
            src={user.profileImageUrl || avatar}
            alt="avatar"
          />
          {loggedUser?.id === user.id ? (
            <button className="bg-blue text-sm rounded-full py-1.5 px-4 font-bold transition-colors hover:bg-blue/80 active:bg-blue/60">
              Edit profile
            </button>
          ) : (
            followButton
          )}
        </div>
        <div className="mb-2">
          <h2 className="text-lg font-bold">{user.name}</h2>
          <p className="text-sm text-secondary">@{user.username}</p>
        </div>
        <p className="break-words whitespace-pre-wrap text-sm mb-2">
          {user.description}
        </p>
        <div className="flex gap-1.5 items-center text-sm text-secondary mb-2">
          <Calendar size={16} />
          <p>Joined {format(joinedDate, 'MMMM y')}</p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link
            className="hover:underline"
            to={userFollowingPath}
            onClick={(e) => {
              if (!loggedUser) {
                e.preventDefault();
                dispatch(pushNotification('Log in to see user likes.'));
              }
            }}
          >
            <span className="font-bold">{user.followedCount}</span>{' '}
            <span className="text-secondary">Following</span>
          </Link>
          <Link
            className="hover:underline"
            to={userFollowersPath}
            onClick={(e) => {
              if (!loggedUser) {
                e.preventDefault();
                dispatch(pushNotification('Log in to see user likes.'));
              }
            }}
          >
            <span className="font-bold">{user.followerCount}</span>{' '}
            <span className="text-secondary">Followers</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
