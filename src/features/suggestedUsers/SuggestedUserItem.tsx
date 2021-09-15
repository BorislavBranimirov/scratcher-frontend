import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { User } from '../../common/types';
import { generateUserPath } from '../../common/routePaths';
import { followUser, unfollowUser } from './suggestedUsersSlice';

const SuggestedUserItem = ({
  user,
  extended,
}: {
  user: User;
  extended?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [followBtnHover, setFollowBtnHover] = useState(false);

  const followButton = user.isFollowing ? (
    <button
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
      {' '}
      {followBtnHover ? 'Unfollow' : 'Following'}
    </button>
  ) : (
    <button
      onClick={() => {
        dispatch(followUser({ id: user.id }));
      }}
    >
      Follow
    </button>
  );

  const userPath = generateUserPath({ username: user.username });

  return (
    <div>
      <p>
        <Link to={userPath}>{user.name}</Link>
      </p>
      <p>@{user.username}</p>
      {followButton}
      {extended && <p>{user.description}</p>}
    </div>
  );
};

export default SuggestedUserItem;
