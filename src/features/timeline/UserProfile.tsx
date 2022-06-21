import { format, parseISO } from 'date-fns';
import { Calendar } from 'react-feather';
import { useAppSelector } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
import { selectTimelineUser } from './timelineSlice';
import avatar from '../../images/avatarplaceholder.png';
import banner from '../../images/bannerplaceholder.png';
import { FollowButton, UserFollowerCounters } from '../users/UserComponents';

const UserProfile = () => {
  const user = useAppSelector(selectTimelineUser);
  const loggedUser = useAppSelector(selectAuthUser);

  if (!user) {
    return <div>User not found</div>;
  }

  const joinedDate = parseISO(user.createdAt);

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
            <FollowButton
              userId={user.id}
              isFollowing={user.isFollowing}
              textSize={'sm'}
            />
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
        <UserFollowerCounters
          username={user.username}
          followedCount={user.followedCount}
          followerCount={user.followerCount}
        />
      </div>
    </div>
  );
};

export default UserProfile;
