import { format, parseISO } from 'date-fns';
import { Calendar } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
import { selectTimelineUser } from './timelineSlice';
import { FollowButton, UserFollowerCounters } from '../users/UserComponents';
import {
  getProfileBannerUrl,
  getProfileImageUrl,
} from '../../common/profileImageUrls';
import { openImagePreview } from '../imagePreview/imagePreviewSlice';

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectTimelineUser);
  const loggedUser = useAppSelector(selectAuthUser);

  if (!user) {
    return <div>User not found</div>;
  }

  const joinedDate = parseISO(user.createdAt);
  const profileImageUrl = getProfileImageUrl(user.profileImageUrl);
  const profileBannerUrl = getProfileBannerUrl(user.profileBannerUrl);

  return (
    <div>
      <img
        className="cursor-pointer"
        src={profileBannerUrl}
        alt="banner"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(openImagePreview(profileBannerUrl));
        }}
      />
      <div className="pt-3 pb-2 px-4">
        <div className="flex justify-between items-start mb-2">
          <img
            className="w-1/5 rounded-full -mt-[12%] border-4 border-neutral cursor-pointer"
            src={profileImageUrl}
            alt="avatar"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(openImagePreview(profileImageUrl));
            }}
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
