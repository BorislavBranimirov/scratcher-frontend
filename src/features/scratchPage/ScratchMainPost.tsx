import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthUserId } from '../auth/authSlice';
import { Link } from 'react-router-dom';
import {
  generateScratchPathWithTab,
  generateUserPath,
} from '../../common/routePaths';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import { useLayoutEffect, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { selectScratchById } from '../scratches/scratchesSlice';
import {
  ScratchMoreButton,
  ScratchLikeButton,
  ScratchReplyButton,
  ScratchRescratchButton,
  ScratchShareButton,
  ScratchImageAttachment,
} from '../scratches/PostComponents';
import useUserPreviewEvents from '../userPreview/useUserPreviewEvents';
import { getProfileImageUrl } from '../../common/profileImageUrls';
import { pushNotification } from '../notification/notificationSlice';

const ScratchMainPost = ({
  scratchId,
  ScratchIdToRedirectOnDelete,
}: {
  scratchId: number;
  ScratchIdToRedirectOnDelete?: number;
}) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);
  const scratch = useAppSelector((state) =>
    selectScratchById(state, scratchId)
  );
  const [userPreviewOnMouseEnter, userPreviewOnMouseLeave] =
    useUserPreviewEvents(scratch.author.username);

  const mainScratchRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (mainScratchRef.current) {
      mainScratchRef.current.scrollIntoView();
    }
  }, [mainScratchRef]);

  const createdAtDate = parseISO(scratch.createdAt);
  const userPath = generateUserPath({ username: scratch.author.username });
  const profileImageUrl = getProfileImageUrl(scratch.author.profileImageUrl);
  const rescratchedUsersPath = generateScratchPathWithTab({
    username: scratch.author.username,
    id: scratch.id,
    tab: 'rescratches',
  });
  const likedUsersPath = generateScratchPathWithTab({
    username: scratch.author.username,
    id: scratch.id,
    tab: 'likes',
  });

  return (
    <div
      ref={mainScratchRef}
      className="border-b border-primary scroll-mt-12 px-4 pt-2 w-full"
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden mt-1 shrink-0">
          <Link
            to={userPath}
            onMouseEnter={userPreviewOnMouseEnter}
            onMouseLeave={userPreviewOnMouseLeave}
          >
            <img src={profileImageUrl} alt="avatar" />
          </Link>
        </div>
        <div className="min-w-0 grow">
          <div className="flex justify-between gap-3">
            <div className="text-muted flex items-baseline min-w-0">
              <Link className="truncate flex flex-col" to={userPath}>
                <span
                  className="font-bold text-main hover:underline"
                  onMouseEnter={userPreviewOnMouseEnter}
                  onMouseLeave={userPreviewOnMouseLeave}
                >
                  {scratch.author.name}
                </span>
                <span
                  className="text-sm"
                  onMouseEnter={userPreviewOnMouseEnter}
                  onMouseLeave={userPreviewOnMouseLeave}
                >
                  @{scratch.author.username}
                </span>
              </Link>
            </div>
            {userId === scratch.authorId && (
              <ScratchMoreButton
                scratchId={scratch.id}
                scratchAuthorUsername={scratch.author.username}
                redirectOnDelete
                ScratchIdToRedirectOnDelete={ScratchIdToRedirectOnDelete}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-3 text-lg">
        <p className="break-words whitespace-pre-wrap">{scratch.body}</p>
        {scratch.mediaUrl && <ScratchImageAttachment url={scratch.mediaUrl} />}
        {scratch.rescratchType === 'quote' && scratch.rescratchedId && (
          <EmbeddedRescratch rescratchedId={scratch.rescratchedId} />
        )}
      </div>
      <div className="my-3 whitespace-nowrap text-sm text-muted">
        <span className="hover:underline">
          {format(createdAtDate, 'h:mm a · d MMM y')}
        </span>
      </div>
      {(scratch.rescratchCount > 0 || scratch.likeCount > 0) && (
        <div className="border-t border-primary py-3 flex gap-3 text-sm">
          {scratch.rescratchCount > 0 && (
            <Link
              className="hover:underline"
              to={rescratchedUsersPath}
              onClick={(e) => {
                if (!userId) {
                  e.preventDefault();
                  dispatch(
                    pushNotification(
                      'Log in to see users who rescratched the post.'
                    )
                  );
                }
              }}
            >
              <span className="font-bold">{scratch.rescratchCount}</span>{' '}
              <span className="text-muted">Rescratches</span>
            </Link>
          )}
          {scratch.likeCount > 0 && (
            <Link
              className="hover:underline"
              to={likedUsersPath}
              onClick={(e) => {
                if (!userId) {
                  e.preventDefault();
                  dispatch(
                    pushNotification('Log in to see users who liked the post.')
                  );
                }
              }}
            >
              <span className="font-bold">{scratch.likeCount}</span>{' '}
              <span className="text-muted">Likes</span>
            </Link>
          )}
        </div>
      )}
      <div className="border-t border-primary py-3.5 flex justify-around">
        <ScratchReplyButton scratchId={scratch.id} iconSize={20} />
        <ScratchRescratchButton
          scratchId={scratch.id}
          scratchIsRescratched={scratch.isRescratched}
          iconSize={20}
        />
        <ScratchLikeButton
          scratchId={scratch.id}
          scratchIsLiked={scratch.isLiked}
          iconSize={20}
        />
        <ScratchShareButton
          scratchId={scratch.id}
          scratchAuthorUsername={scratch.author.username}
          scratchIsBookmarked={scratch.isBookmarked}
          isLogged={userId !== null}
          iconSize={20}
        />
      </div>
    </div>
  );
};

export default ScratchMainPost;
