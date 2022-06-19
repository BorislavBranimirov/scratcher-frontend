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
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { generateScratchPath } from '../../common/routePaths';
import { selectAuthUserPinnedId } from '../auth/authSlice';
import { openReplyModal, openRescratchModal } from '../modal/modalSlice';
import { pushNotification } from '../notification/notificationSlice';
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

  return (
    <div className="relative">
      <button
        className="text-secondary transition-colors hover:text-post-btn-default h-full"
        onClick={(e) => {
          e.stopPropagation();
          setMoreOptionsToggle(true);
        }}
      >
        <div className="relative" title="More">
          <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors hover:bg-blue/10 active:bg-blue/20"></div>
          <MoreHorizontal size={16} className="stroke-current" />
        </div>
      </button>
      <div
        className={`fixed top-0 right-0 bottom-0 left-0 cursor-auto z-20 ${
          !moreOptionsToggle ? 'hidden' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setMoreOptionsToggle(false);
        }}
      ></div>
      <div
        className={`absolute top-0 right-0 bg-neutral flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
          !moreOptionsToggle ? 'hidden' : ''
        }`}
      >
        <button
          className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 active:bg-primary/10 flex items-center gap-3 text-delete"
          onClick={async (e) => {
            e.stopPropagation();
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
            setMoreOptionsToggle(false);
          }}
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
        <button
          className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 active:bg-primary/10 flex items-center gap-3"
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
    <div>
      <button
        className={`text-secondary transition-colors hover:text-post-btn-default group ${
          !!text ? 'text-sm flex items-center' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(openReplyModal({ parentId: scratchId }));
        }}
      >
        <div className="relative mr-3" title="Reply">
          <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors group-hover:bg-blue/10"></div>
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
    <div className="relative">
      <button
        className={`${
          scratchIsRescratched
            ? 'text-post-btn-green'
            : 'text-secondary transition-colors hover:text-post-btn-green'
        } group ${!!text ? 'text-sm flex items-center' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setRescratchToggle(true);
        }}
      >
        <div className="relative mr-3" title="Rescratch">
          <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors group-hover:bg-blue/10"></div>
          <Repeat size={iconSize} className="stroke-current" />
        </div>
        <span>{text}</span>
      </button>
      <div
        className={`fixed top-0 right-0 bottom-0 left-0 cursor-auto z-20 ${
          !rescratchToggle ? 'hidden' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setRescratchToggle(false);
        }}
      ></div>
      <div
        className={`absolute top-0 right-0 bg-neutral flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
          !rescratchToggle ? 'hidden' : ''
        }`}
      >
        <button
          className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 active:bg-primary/10 flex items-center gap-3"
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
          className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 active:bg-primary/10 flex items-center gap-3"
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
    <div>
      <button
        className={`${
          scratchIsLiked
            ? 'text-post-btn-red'
            : 'text-secondary transition-colors hover:text-post-btn-red'
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
          <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors group-hover:bg-blue/10"></div>
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
    <div className="relative">
      <button
        className="text-secondary transition-colors hover:text-post-btn-default"
        onClick={(e) => {
          e.stopPropagation();
          setShareToggle(true);
        }}
      >
        <div className="relative" title="Share">
          <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors hover:bg-blue/10"></div>
          <Share size={iconSize} className="stroke-current" />
        </div>
      </button>
      <div
        className={`fixed top-0 right-0 bottom-0 left-0 cursor-auto z-20 ${
          !shareToggle ? 'hidden' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setShareToggle(false);
        }}
      ></div>
      <div
        className={`absolute top-0 right-0 bg-neutral flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
          !shareToggle ? 'hidden' : ''
        }`}
      >
        {isLogged && (
          <button
            className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 active:bg-primary/10 flex items-center gap-3"
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
          className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 active:bg-primary/10 flex items-center gap-3"
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
