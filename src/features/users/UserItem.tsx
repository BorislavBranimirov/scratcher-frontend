import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { generateUserPath } from '../../common/routePaths';
import { followUser, selectUserById, unfollowUser } from './usersSlice';
import avatar from '../../images/avatarplaceholder.png';

const UserItem = ({
  userId,
  extended,
}: {
  userId: number;
  extended?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => selectUserById(state, userId));
  const navigate = useNavigate();
  const [followBtnHover, setFollowBtnHover] = useState(false);

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
      <div className={`grow flex ${!extended && 'items-center'} gap-3 min-w-0`}>
        <div
          className={`${
            extended ? 'w-12 h-12' : 'w-10 h-10'
          } rounded-full overflow-hidden mt-1 shrink-0`}
        >
          <Link to={userPath}>
            <img src={user.profileImageUrl || avatar} alt="avatar" />
          </Link>
        </div>
        <div className="grow overflow-hidden leading-5">
          <div className="flex gap-3 items-center justify-between">
            <div className="truncate">
              <Link to={userPath}>
                <span className="font-bold text-primary hover:underline">
                  {user.name}
                </span>
              </Link>
              <p className="text-secondary text-sm truncate">
                @{user.username}
              </p>
            </div>
            {followButton}
          </div>
          {extended && (
            <p className="break-words whitespace-pre-wrap text-sm pt-1 pb-1">
              {user.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserItem;
