import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { generateUserPath } from '../../common/routePaths';
import { User } from '../../common/types';
import avatar from '../../images/avatarplaceholder.png';
import { followUser, unfollowUser } from './timelineSlice';

const FollowersItem = ({ user }: { user: User }) => {
  const dispatch = useAppDispatch();
  const [followBtnHover, setFollowBtnHover] = useState(false);
  const navigate = useNavigate();

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
        followBtnHover
          ? 'bg-red hover:bg-red/80 active:bg-red/60'
          : 'bg-blue hover:bg-blue/80 active:bg-blue/60'
      } text-xs rounded-full py-1.5 px-4 font-bold transition-colors`}
    >
      {followBtnHover ? 'Unfollow' : 'Following'}
    </button>
  ) : (
    <button
      onClick={(e) => {
        e.stopPropagation();
        dispatch(followUser({ id: user.id }));
      }}
      className="bg-blue text-xs rounded-full py-1.5 px-4 font-bold transition-colors hover:bg-blue/80 active:bg-blue/60"
    >
      Follow
    </button>
  );

  const userPath = generateUserPath({ username: user.username });

  return (
    <div
      className="py-2 px-3 cursor-pointer transition-colors duration-200 hover:bg-primary/5"
      onClick={(e) => {
        const target = e.target as Element;
        if (!target.closest('a')) navigate(userPath);
      }}
    >
      <div className="grow flex gap-3 min-w-0">
        <div className="w-12 h-12 rounded-full overflow-hidden mt-1 shrink-0">
          <Link to={userPath}>
            <img src={user.profileImageUrl || avatar} alt="avatar" />
          </Link>
        </div>
        <div className="grow overflow-hidden leading-5">
          <div className="flex gap-3 items-center justify-between">
            <div className="truncate">
              <Link to={userPath}>
                <span className="font-bold text-primary hover:underline">
                  {user?.name}
                </span>
              </Link>
              <p className="text-secondary text-sm truncate">
                @{user?.username}
              </p>
            </div>
            {followButton}
          </div>
          <p className="break-words whitespace-pre-wrap text-sm pt-1 pb-1">
            {user.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FollowersItem;
