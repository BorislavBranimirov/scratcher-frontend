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
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectTimelineUser);
  const loggedUser = useAppSelector(selectAuthUser);
  const navigate = useNavigate();

  if (!user) {
    return <div>User not found</div>;
  }

  const joinedDate = parseISO(user.createdAt);
  const profileImageUrl = getProfileImageUrl(user.profileImageUrl);
  const profileBannerUrl = getProfileBannerUrl(user.profileBannerUrl);

  return (
    <div>
      <div className="relative w-full overflow-hidden">
        <div className="pb-[33.3333%]"></div>
        <img
          className="absolute top-0 left-0 right-0 mx-auto cursor-pointer"
          src={profileBannerUrl}
          alt="banner"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(openImagePreview(profileBannerUrl));
          }}
        />
      </div>
      <div className="pt-3 pb-2 px-4">
        <div className="flex justify-between items-start mb-2">
          <div className="relative w-1/4 -mt-[14%] rounded-full overflow-hidden border-4 border-neutral">
            <div className="pb-[100%]"></div>
            <img
              className="absolute top-0 left-0 w-full h-full cursor-pointer"
              src={profileImageUrl}
              alt="avatar"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(openImagePreview(profileImageUrl));
              }}
            />
          </div>
          {loggedUser?.id === user.id ? (
            <button
              className="bg-blue text-sm rounded-full py-1.5 px-4 font-bold transition-colors hover:bg-blue/80 active:bg-blue/60"
              onClick={() => {
                navigate('/settings/edit-profile');
              }}
            >
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
