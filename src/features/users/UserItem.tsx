import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { generateUserPath } from '../../common/routePaths';
import { selectUserById } from './usersSlice';
import avatar from '../../images/avatarplaceholder.png';
import { FollowButton } from './UserComponents';
import useUserPreviewEvents from '../userPreview/useUserPreviewEvents';

const UserItem = ({
  userId,
  extended,
}: {
  userId: number;
  extended?: boolean;
}) => {
  const user = useAppSelector((state) => selectUserById(state, userId));
  const navigate = useNavigate();
  const [userPreviewOnMouseEnter, userPreviewOnMouseLeave] =
    useUserPreviewEvents(user.username);

  const userPath = generateUserPath({ username: user.username });

  return (
    <div
      className="py-2 px-3 cursor-pointer transition-colors duration-200 hover:bg-primary/5"
      onClick={(e) => {
        const target = e.target as Element;
        if (!target.closest('a')) navigate(userPath);
      }}
    >
      <div
        className={`grow flex ${!extended ? 'items-center' : ''} gap-3 min-w-0`}
      >
        <div
          className={`${
            extended ? 'w-12 h-12' : 'w-10 h-10'
          } rounded-full overflow-hidden mt-1 shrink-0`}
        >
          <Link
            to={userPath}
            onMouseEnter={userPreviewOnMouseEnter}
            onMouseLeave={userPreviewOnMouseLeave}
          >
            <img src={user.profileImageUrl || avatar} alt="avatar" />
          </Link>
        </div>
        <div className="grow overflow-hidden leading-5">
          <div className="flex gap-3 items-center justify-between">
            <div className="truncate">
              <Link to={userPath}>
                <span
                  className="font-bold text-primary hover:underline"
                  onMouseEnter={userPreviewOnMouseEnter}
                  onMouseLeave={userPreviewOnMouseLeave}
                >
                  {user.name}
                </span>
              </Link>
              <p
                className="text-secondary text-sm truncate"
                onMouseEnter={userPreviewOnMouseEnter}
                onMouseLeave={userPreviewOnMouseLeave}
              >
                @{user.username}
              </p>
            </div>
            <FollowButton userId={user.id} isFollowing={user.isFollowing} />
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
