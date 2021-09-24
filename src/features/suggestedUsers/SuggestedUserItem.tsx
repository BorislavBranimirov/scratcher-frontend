import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { User } from '../../common/types';
import { generateUserPath } from '../../common/routePaths';
import { followUser, unfollowUser } from './suggestedUsersSlice';
import avatar from '../../images/avatarplaceholder.png';

const SuggestedUserItem = ({
  user,
  extended,
}: {
  user: User;
  extended?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [followBtnHover, setFollowBtnHover] = useState(false);
  const history = useHistory();

  const followButton = user.isFollowing ? (
    <button
      onMouseEnter={() => {
        setFollowBtnHover(true);
      }}
      onMouseLeave={() => {
        setFollowBtnHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(unfollowUser({ id: user.id }));
      }}
      className={`${
        followBtnHover ? 'bg-red' : 'bg-blue'
      } text-xs rounded-full py-1.5 px-4 font-bold transition-colors hover:bg-opacity-80 active:bg-opacity-60`}
    >
      {followBtnHover ? 'Unfollow' : 'Following'}
    </button>
  ) : (
    <button
      onClick={(e) => {
        e.stopPropagation();
        dispatch(followUser({ id: user.id }));
      }}
      className="bg-blue text-xs rounded-full py-1.5 px-4 font-bold transition-colors hover:bg-opacity-80 active:bg-opacity-60"
    >
      Follow
    </button>
  );

  const userPath = generateUserPath({ username: user.username });

  return (
    <div
      className="flex items-center justify-between py-2 px-3 cursor-pointer transition-colors duration-200 hover:bg-primary hover:bg-opacity-5"
      onClick={(e) => {
        const target = e.target as Element;
        if (!target.closest('a')) history.push(userPath);
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full overflow-hidden mt-1 flex-shrink-0">
          <Link to={userPath}>
            <img src={user.profileImageUrl || avatar} alt="avatar" />
          </Link>
        </div>
        <div className="overflow-hidden leading-5 hidden lg:block">
          <Link className="truncate" to={userPath}>
            <span className="font-bold text-primary hover:underline">
              {user?.name}
            </span>
          </Link>
          <p className="text-secondary text-sm truncate">@{user?.username}</p>
          {/*extended && <p>{user.description}</p>*/}
        </div>
      </div>
      {followButton}
    </div>
  );
};

export default SuggestedUserItem;
