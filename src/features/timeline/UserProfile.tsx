import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
import {
  followUserPage,
  selectTimelineUser,
  unfollowUserPage,
} from './timelineSlice';

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectTimelineUser);
  const loggedUser = useAppSelector(selectAuthUser);

  const [followBtnHover, setFollowBtnHover] = useState(false);

  if (!user) {
    return <div>Not found</div>;
  }

  const followButton = user.isFollowing ? (
    <button
      onMouseEnter={() => {
        setFollowBtnHover(true);
      }}
      onMouseLeave={() => {
        setFollowBtnHover(false);
      }}
      onClick={() => {
        dispatch(unfollowUserPage({ id: user.id }));
      }}
    >
      {followBtnHover ? 'Unfollow' : 'Following'}
    </button>
  ) : (
    <button
      onClick={() => {
        dispatch(followUserPage({ id: user.id }));
      }}
    >
      Follow
    </button>
  );

  return (
    <div>
      <hr />
      <p>Banner</p>
      <p>Avatar</p>
      <p>{user.name}</p>
      <p>@{user.username}</p>
      {loggedUser?.id === user.id ? (
        <button>Edit profile</button>
      ) : (
        followButton
      )}
      <p>{user.description}</p>
      <p>Joined {user.createdAt}</p>
      <span>{user.followedCount} Following</span>{' '}
      <span>{user.followerCount} Followers</span>
      <hr />
    </div>
  );
};

export default UserProfile;
