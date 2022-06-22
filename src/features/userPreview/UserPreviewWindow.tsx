import { useAppSelector } from '../../app/hooks';
import {
  closeUserPreview,
  selectUserPreviewMouseLeft,
  selectUserPreviewPos,
  selectUserPreviewUser,
  setUserPreviewMouseLeft,
} from './userPreviewSlice';
import avatar from '../../images/avatarplaceholder.png';
import { FollowButton, UserFollowerCounters } from '../users/UserComponents';
import { Link, useLocation } from 'react-router-dom';
import { generateUserPath } from '../../common/routePaths';
import { shallowEqual, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectAuthUser } from '../auth/authSlice';
import { useRef } from 'react';
import { useLayoutEffect } from 'react';

const UserPreviewWindow = () => {
  const dispatch = useDispatch();
  const parentPos = useAppSelector(selectUserPreviewPos, shallowEqual);
  const mouseLeft = useAppSelector(selectUserPreviewMouseLeft);
  const user = useAppSelector(selectUserPreviewUser);
  const loggedUser = useAppSelector(selectAuthUser);
  const [isUnmounting, setIsUnmounting] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    return () => {
      dispatch(closeUserPreview());
    };
  }, [location, dispatch]);

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.classList.replace('opacity-0', 'opacity-100');
      setIsUnmounting(false);
    }
  }, [parentPos]);

  useEffect(() => {
    if (popupRef.current && isUnmounting) {
      popupRef.current.classList.replace('opacity-100', 'opacity-0');
    }
  }, [isUnmounting]);

  useEffect(() => {
    if (mouseLeft) {
      let closeTimeout: NodeJS.Timeout | undefined;
      const transitionTimeout = setTimeout(() => {
        // prepare to unmount to allow for opacity transition to play
        setIsUnmounting(true);
        closeTimeout = setTimeout(() => {
          dispatch(closeUserPreview());
        }, 300);
      }, 300);

      return () => {
        clearTimeout(transitionTimeout);
        clearTimeout(closeTimeout);
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

  if (!user) {
    return null;
  }

  const userPath = generateUserPath({ username: user.username });

  return (
    <div
      className="absolute w-80 z-30 bg-neutral shadow rounded-2xl transition-opacity duration-300 opacity-0"
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
          {loggedUser && loggedUser.id !== user.id && (
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
