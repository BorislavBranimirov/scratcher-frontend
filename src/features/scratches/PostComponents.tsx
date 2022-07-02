import { useState } from 'react';
import {
  Bookmark,
  Edit2,
  Heart,
  Link as LinkIcon,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Repeat,
  Share,
  Trash2,
} from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { generateScratchPath, generateUserPath } from '../../common/routePaths';
import { Author } from '../../common/types';
import { selectAuthUserPinnedId } from '../auth/authSlice';
import ConfirmPrompt from '../../common/ConfirmPrompt';
import { openReplyModal, openRescratchModal } from '../modal/modalSlice';
import { pushNotification } from '../notification/notificationSlice';
import useUserPreviewEvents from '../userPreview/useUserPreviewEvents';
import {
  addRescratch,
  bookmarkScratch,
  likeScratch,
  pinScratch,
  removeScratch,
  unbookmarkScratch,
  undoAddRescratch,
  unlikeScratch,
  unpinScratch,
} from './scratchesSlice';
import { openImagePreview } from '../imagePreview/imagePreviewSlice';

export const ScratchRescratchedByStatus = ({
  rescratchAuthor,
}: {
  rescratchAuthor: Author;
}) => {
  const [userPreviewOnMouseEnter, userPreviewOnMouseLeave] =
    useUserPreviewEvents(rescratchAuthor.username);

  return (
    <div className="mb-1 flex gap-3 items-center text-sm text-muted">
      <div className="w-12">
        <Repeat className="ml-auto" size={13} />
      </div>
      <Link
        className="hover:underline"
        to={generateUserPath({ username: rescratchAuthor.username })}
        onMouseEnter={userPreviewOnMouseEnter}
        onMouseLeave={userPreviewOnMouseLeave}
      >
        {rescratchAuthor.name} Rescratched
      </Link>
    </div>
  );
};

export const ScratchReplyingToStatus = ({
  parentUsername,
}: {
  parentUsername: string;
}) => {
  const [userPreviewOnMouseEnter, userPreviewOnMouseLeave] =
    useUserPreviewEvents(parentUsername);

  const parentUserPath = generateUserPath({
    username: parentUsername,
  });

  return (
    <div className="flex gap-1 text-sm text-muted">
      <span>Replying to</span>
      <Link
        className="text-accent hover:underline"
        to={parentUserPath}
        onMouseEnter={userPreviewOnMouseEnter}
        onMouseLeave={userPreviewOnMouseLeave}
      >
        @{parentUsername}
      </Link>
    </div>
  );
};

export const ScratchMoreButton = ({
  scratchId,
  scratchAuthorUsername,
  redirectOnDelete,
  ScratchIdToRedirectOnDelete,
}: {
  scratchId: number;
  scratchAuthorUsername: string;
  redirectOnDelete?: boolean;
  ScratchIdToRedirectOnDelete?: number;
}) => {
  const dispatch = useAppDispatch();
  const userPinnedId = useAppSelector(selectAuthUserPinnedId);
  const navigate = useNavigate();

  const [moreOptionsToggle, setMoreOptionsToggle] = useState(false);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);

  return (
    <div className="relative">
      <button
        className="text-muted transition-colors hover:text-accent h-full"
        onClick={(e) => {
          e.stopPropagation();
          setMoreOptionsToggle(true);
        }}
      >
        <div className="relative" title="More">
          <div className="absolute inset-0 -m-2 rounded-full transition-colors hover:bg-accent/10 active:bg-accent/20"></div>
          <MoreHorizontal size={16} className="stroke-current" />
        </div>
      </button>
      <div
        className={`fixed inset-0 cursor-auto z-20 ${
          !moreOptionsToggle ? 'hidden' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setMoreOptionsToggle(false);
        }}
      ></div>
      <div
        className={`absolute top-0 right-0 bg-primary flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
          !moreOptionsToggle ? 'hidden' : ''
        }`}
      >
        <button
          className="whitespace-nowrap p-4 transition-colors hover:bg-hover-1 active:bg-hover-2 flex items-center gap-3 text-danger"
          onClick={async (e) => {
            e.stopPropagation();
            setShowConfirmPrompt(true);
            setMoreOptionsToggle(false);
          }}
        >
          {showConfirmPrompt && (
            <ConfirmPrompt
              title="Delete Scratch?"
              body="This can't be undone and it will be removed from your profile, timeline of any accounts that follow you, and from Scratcher search results."
              acceptText="Delete"
              declineText="Cancel"
              acceptCallback={async () => {
                const res = await dispatch(removeScratch({ id: scratchId }));
                if (removeScratch.fulfilled.match(res)) {
                  if (redirectOnDelete) {
                    if (ScratchIdToRedirectOnDelete) {
                      navigate(
                        generateScratchPath({
                          username: scratchAuthorUsername,
                          id: ScratchIdToRedirectOnDelete,
                        })
                      );
                    } else {
                      navigate('/');
                    }
                  }
                }
                setShowConfirmPrompt(false);
              }}
              declineCallback={() => {
                setShowConfirmPrompt(false);
              }}
            />
          )}
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
        <button
          className="whitespace-nowrap p-4 transition-colors hover:bg-hover-1 active:bg-hover-2 flex items-center gap-3"
          onClick={(e) => {
            e.stopPropagation();
            if (userPinnedId === scratchId) {
              dispatch(unpinScratch({ id: scratchId }));
            } else {
              dispatch(pinScratch({ id: scratchId }));
            }
            setMoreOptionsToggle(false);
          }}
        >
          <Paperclip size={16} />
          <span>
            {userPinnedId === scratchId
              ? 'Unpin from your profile'
              : 'Pin to your profile'}
          </span>
        </button>
      </div>
    </div>
  );
};

export const ScratchImageAttachment = ({
  url,
  cropImage = false,
}: {
  url: string;
  cropImage?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const mediaUrl =
    'https://res.cloudinary.com/quiz-media/image/upload/f_auto/' + url;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        dispatch(openImagePreview(mediaUrl));
      }}
      className={`my-2 rounded-2xl flex items-center overflow-hidden${
        cropImage ? ' max-h-[60vh]' : ''
      }`}
    >
      <img src={mediaUrl} alt="attachment" className="w-full h-auto" />
    </div>
  );
};

export const ScratchReplyButton = ({
  scratchId,
  text,
  iconSize = 16,
}: {
  scratchId: number;
  text?: string;
  iconSize?: number;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-center items-center">
      <button
        className={`text-muted transition-colors hover:text-accent group ${
          !!text ? 'text-sm flex items-center' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(openReplyModal({ parentId: scratchId }));
        }}
      >
        <div className="relative mr-3" title="Reply">
          <div className="absolute inset-0 -m-2 rounded-full transition-colors group-hover:bg-accent/10 group-active:bg-accent/20"></div>
          <MessageCircle size={iconSize} className="stroke-current" />
        </div>
        {text}
      </button>
    </div>
  );
};

export const ScratchRescratchButton = ({
  scratchId,
  scratchIsRescratched,
  text,
  iconSize = 16,
}: {
  scratchId: number;
  scratchIsRescratched: boolean;
  text?: string;
  iconSize?: number;
}) => {
  const dispatch = useAppDispatch();
  const [rescratchToggle, setRescratchToggle] = useState(false);

  return (
    <div className="relative flex justify-center items-center">
      <button
        className={`${
          scratchIsRescratched
            ? 'text-btn-share'
            : 'text-muted transition-colors hover:text-btn-share'
        } group ${!!text ? 'text-sm flex items-center' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setRescratchToggle(true);
        }}
      >
        <div className="relative mr-3" title="Rescratch">
          <div className="absolute inset-0 -m-2 rounded-full transition-colors group-hover:bg-btn-share/10 group-active:bg-btn-share/20"></div>
          <Repeat size={iconSize} className="stroke-current" />
        </div>
        <span>{text}</span>
      </button>
      <div
        className={`fixed inset-0 cursor-auto z-20 ${
          !rescratchToggle ? 'hidden' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setRescratchToggle(false);
        }}
      ></div>
      <div
        className={`absolute top-0 right-0 bg-primary flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
          !rescratchToggle ? 'hidden' : ''
        }`}
      >
        <button
          className="whitespace-nowrap p-4 transition-colors hover:bg-hover-1 active:bg-hover-2 flex items-center gap-3"
          onClick={(e) => {
            e.stopPropagation();
            if (scratchIsRescratched) {
              dispatch(undoAddRescratch({ id: scratchId }));
            } else {
              dispatch(addRescratch({ rescratchedId: scratchId }));
            }
            setRescratchToggle(false);
          }}
        >
          <Repeat size={16} />
          <span>{scratchIsRescratched ? 'Undo Rescratch' : 'Rescratch'}</span>
        </button>
        <button
          className="whitespace-nowrap p-4 transition-colors hover:bg-hover-1 active:bg-hover-2 flex items-center gap-3"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(openRescratchModal({ rescratchedId: scratchId }));
            setRescratchToggle(false);
          }}
        >
          <Edit2 size={16} />
          <span>Quote Scratch</span>
        </button>
      </div>
    </div>
  );
};

export const ScratchLikeButton = ({
  scratchId,
  scratchIsLiked,
  text,
  iconSize = 16,
}: {
  scratchId: number;
  scratchIsLiked: boolean;
  text?: string;
  iconSize?: number;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-center items-center">
      <button
        className={`${
          scratchIsLiked
            ? 'text-btn-like'
            : 'text-muted transition-colors hover:text-btn-like'
        } group ${!!text ? 'text-sm flex items-center' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (scratchIsLiked) {
            dispatch(unlikeScratch({ id: scratchId }));
          } else {
            dispatch(likeScratch({ id: scratchId }));
          }
        }}
      >
        <div className="relative mr-3" title="Like">
          <div className="absolute inset-0 -m-2 rounded-full transition-colors group-hover:bg-btn-like/10 group-active:bg-btn-like/20"></div>
          <Heart
            size={iconSize}
            className={`stroke-current ${scratchIsLiked ? 'fill-current' : ''}`}
          />
        </div>
        {text}
      </button>
    </div>
  );
};

export const ScratchShareButton = ({
  scratchId,
  scratchAuthorUsername,
  scratchIsBookmarked,
  isLogged,
  iconSize = 16,
}: {
  scratchId: number;
  scratchAuthorUsername: string;
  scratchIsBookmarked: boolean;
  isLogged: boolean;
  iconSize?: number;
}) => {
  const dispatch = useAppDispatch();
  const [shareToggle, setShareToggle] = useState(false);

  const scratchPath = generateScratchPath({
    username: scratchAuthorUsername,
    id: scratchId,
  });

  return (
    <div className="relative flex justify-center items-center">
      <button
        className="text-muted transition-colors hover:text-accent"
        onClick={(e) => {
          e.stopPropagation();
          setShareToggle(true);
        }}
      >
        <div className="relative" title="Share">
          <div className="absolute inset-0 -m-2 rounded-full transition-colors hover:bg-accent/10 active:bg-accent/20"></div>
          <Share size={iconSize} className="stroke-current" />
        </div>
      </button>
      <div
        className={`fixed inset-0 cursor-auto z-20 ${
          !shareToggle ? 'hidden' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setShareToggle(false);
        }}
      ></div>
      <div
        className={`absolute top-0 right-0 bg-primary flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
          !shareToggle ? 'hidden' : ''
        }`}
      >
        {isLogged && (
          <button
            className="whitespace-nowrap p-4 transition-colors hover:bg-hover-1 active:bg-hover-2 flex items-center gap-3"
            onClick={(e) => {
              e.stopPropagation();
              if (scratchIsBookmarked) {
                dispatch(unbookmarkScratch({ id: scratchId }));
              } else {
                dispatch(bookmarkScratch({ id: scratchId }));
              }
              setShareToggle(false);
            }}
          >
            <Bookmark size={16} />
            <span>
              {scratchIsBookmarked
                ? 'Remove scratch from bookmarks'
                : 'Add scratch to bookmarks'}
            </span>
          </button>
        )}
        <button
          className="whitespace-nowrap p-4 transition-colors hover:bg-hover-1 active:bg-hover-2 flex items-center gap-3"
          onClick={(e) => {
            e.stopPropagation();
            const scratchUrl = window.location.origin + scratchPath;
            navigator.clipboard.writeText(scratchUrl);
            dispatch(pushNotification('Copied to clipboard'));
            setShareToggle(false);
          }}
        >
          <LinkIcon size={16} />
          <span>Copy link to scratch</span>
        </button>
      </div>
    </div>
  );
};
