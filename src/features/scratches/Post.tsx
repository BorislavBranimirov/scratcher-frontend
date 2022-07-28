import { useAppSelector } from '../../app/hooks';
import { Author } from '../../common/types';
import { selectAuthUserId } from '../auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { generateScratchPath, generateUserPath } from '../../common/routePaths';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import TimeAgo from '../../common/TimeAgo';
import { Paperclip } from 'react-feather';
import { selectScratchById } from '../scratches/scratchesSlice';
import {
  ScratchMoreButton,
  ScratchLikeButton,
  ScratchReplyButton,
  ScratchRescratchButton,
  ScratchShareButton,
  ScratchRescratchedByStatus,
  ScratchReplyingToStatus,
  ScratchImageAttachment,
} from './PostComponents';
import useUserPreviewEvents from '../userPreview/useUserPreviewEvents';
import { getProfileImageUrl } from '../../common/profileImageUrls';

const Post = ({
  scratchId,
  rescratchAuthor,
  pinned,
  parentUsername,
  timelineScratch,
  redirectOnDelete,
  ScratchIdToRedirectOnDelete,
}: {
  scratchId: number;
  rescratchAuthor?: Author;
  pinned?: Boolean;
  parentUsername?: string;
  timelineScratch?: boolean;
  redirectOnDelete?: boolean;
  ScratchIdToRedirectOnDelete?: number;
}) => {
  const userId = useAppSelector(selectAuthUserId);
  const scratch = useAppSelector((state) =>
    selectScratchById(state, scratchId)
  );
  const navigate = useNavigate();
  const [userPreviewOnMouseEnter, userPreviewOnMouseLeave] =
    useUserPreviewEvents(scratch.author.username);

  const userPath = generateUserPath({ username: scratch.author.username });
  const scratchPath = generateScratchPath({
    username: scratch.author.username,
    id: scratch.id,
  });
  const profileImageUrl = getProfileImageUrl(scratch.author.profileImageUrl);

  return (
    <div
      className={`${
        timelineScratch ? 'relative' : 'border-b border-primary'
      } px-4 py-2 cursor-pointer w-full transition-colors duration-200 hover:bg-hover-1`}
      data-cy={`scratch-post-${scratch.id}`}
      onClick={(e) => {
        const target = e.target as Element;
        if (!target.closest('a')) navigate(scratchPath);
      }}
    >
      {timelineScratch && (
        <div className="absolute ml-4 mt-3 w-12 flex flex-col items-center top-0 h-full left-0">
          <div className="w-0.5 bg-reply-line grow"></div>
        </div>
      )}
      {pinned && (
        <div className="mb-1 flex gap-3 items-center text-sm text-muted">
          <div className="w-12">
            <Paperclip className="ml-auto" size={13} />
          </div>
          <span>Pinned Scratch</span>
        </div>
      )}
      {rescratchAuthor && (
        <ScratchRescratchedByStatus rescratchAuthor={rescratchAuthor} />
      )}
      <div className={`${timelineScratch ? 'relative ' : ''}flex gap-3`}>
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
              <Link className="truncate" to={userPath}>
                <span
                  className="font-bold text-main hover:underline"
                  onMouseEnter={userPreviewOnMouseEnter}
                  onMouseLeave={userPreviewOnMouseLeave}
                >
                  {scratch.author.name}
                </span>
                <span
                  className="text-sm ml-1"
                  onMouseEnter={userPreviewOnMouseEnter}
                  onMouseLeave={userPreviewOnMouseLeave}
                >
                  @{scratch.author.username}
                </span>
              </Link>
              <span className="text-sm px-1">·</span>
              <div className="whitespace-nowrap">
                <TimeAgo createdAt={scratch.createdAt} />
              </div>
            </div>
            {userId === scratch.authorId && (
              <ScratchMoreButton
                scratchId={scratch.id}
                scratchAuthorUsername={scratch.author.username}
                redirectOnDelete={redirectOnDelete}
                ScratchIdToRedirectOnDelete={ScratchIdToRedirectOnDelete}
              />
            )}
          </div>
          <div className="flex flex-col">
            {parentUsername && (
              <ScratchReplyingToStatus parentUsername={parentUsername} />
            )}
            <p className="break-words whitespace-pre-wrap">{scratch.body}</p>
            {scratch.mediaUrl && (
              <ScratchImageAttachment url={scratch.mediaUrl} cropImage />
            )}
            {scratch.rescratchType === 'quote' && scratch.rescratchedId && (
              <EmbeddedRescratch rescratchedId={scratch.rescratchedId} />
            )}
            <div className="flex justify-between w-10/12 mt-2 mb-1">
              <ScratchReplyButton
                scratchId={scratch.id}
                text={scratch.replyCount.toString()}
              />
              <ScratchRescratchButton
                scratchId={scratch.id}
                scratchIsRescratched={scratch.isRescratched}
                text={scratch.rescratchCount.toString()}
              />
              <ScratchLikeButton
                scratchId={scratch.id}
                scratchIsLiked={scratch.isLiked}
                text={scratch.likeCount.toString()}
              />
              <ScratchShareButton
                scratchId={scratch.id}
                scratchAuthorUsername={scratch.author.username}
                scratchIsBookmarked={scratch.isBookmarked}
                isLogged={userId !== null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
