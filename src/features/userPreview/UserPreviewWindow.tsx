import { useAppSelector } from '../../app/hooks';
import {
  closeUserPreview,
  selectUserPreviewMouseLeft,
  selectUserPreviewPos,
  selectUserPreviewShow,
  selectUserPreviewUser,
  setUserPreviewMouseLeft,
} from './userPreviewSlice';
import avatar from '../../images/avatarplaceholder.png';
import { FollowButton, UserFollowerCounters } from '../users/UserComponents';
import { Link, useLocation } from 'react-router-dom';
import { generateUserPath } from '../../common/routePaths';
import { shallowEqual, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectAuthUser } from '../auth/authSlice';
import { useRef } from 'react';
import { useLayoutEffect } from 'react';

const UserPreviewWindow = () => {
  const dispatch = useDispatch();
  const show = useAppSelector(selectUserPreviewShow);
  const parentPos = useAppSelector(selectUserPreviewPos, shallowEqual);
  const mouseLeft = useAppSelector(selectUserPreviewMouseLeft);
  const user = useAppSelector(selectUserPreviewUser);
  const loggedUser = useAppSelector(selectAuthUser);
  const popupRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    return () => {
      dispatch(closeUserPreview());
    };
  }, [location, dispatch]);

  useEffect(() => {
    if (mouseLeft) {
      const timeout = setTimeout(() => {
        dispatch(closeUserPreview());
      }, 300);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [mouseLeft, dispatch]);

  useLayoutEffect(() => {
    if (popupRef.current) {
      const popupWidth = popupRef.current.clientWidth;
      const popupHeight = popupRef.current.clientHeight;
      const leftSideOfViewport = 0;
      const bottomOfViewport =
        window.scrollY + document.documentElement.clientHeight;

      const offsetY = 8;

      let posX = parentPos.x - (popupWidth / 2 - parentPos.width / 2);
      let posY = parentPos.y + parentPos.height + offsetY;

      // if cut off left of viewport, align with parent
      if (posX < leftSideOfViewport) {
        posX = parentPos.x;
      }
      // if cut off below viewport, place above parent
      if (posY + popupHeight > bottomOfViewport) {
        posY = parentPos.y - (popupHeight + offsetY);
      }

      popupRef.current.style.left = posX + 'px';
      popupRef.current.style.top = posY + 'px';
    }
  }, [parentPos, user]);

  if (!show || !user) {
    return null;
  }

  const userPath = generateUserPath({ username: user.username });

  return (
    <div
      className="absolute w-80 z-30 bg-neutral shadow rounded-2xl"
      ref={popupRef}
      onMouseEnter={() => {
        dispatch(setUserPreviewMouseLeft(false));
      }}
      onMouseLeave={() => {
        dispatch(setUserPreviewMouseLeft(true));
      }}
    >
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <Link to={userPath}>
              <img src={user.profileImageUrl || avatar} alt="avatar" />
            </Link>
          </div>
          {loggedUser?.id !== user.id && (
            <FollowButton
              userId={user.id}
              isFollowing={user.isFollowing}
              textSize={'sm'}
            />
          )}
        </div>
        <div className="mt-2 w-max">
          <Link to={userPath}>
            <h2 className="font-bold hover:underline leading-5">{user.name}</h2>
            <p className="text-sm text-secondary">@{user.username}</p>
          </Link>
        </div>
        <div className="mt-1">
          <p className="break-words whitespace-pre-wrap text-sm">
            {user.description}
          </p>
        </div>
        <div className="mt-2">
          <UserFollowerCounters
            username={user.username}
            followedCount={user.followedCount}
            followerCount={user.followerCount}
          />
        </div>
      </div>
    </div>
  );
};

export default UserPreviewWindow;
