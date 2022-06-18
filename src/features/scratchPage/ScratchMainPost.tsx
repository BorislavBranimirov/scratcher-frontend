import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthUserId, selectAuthUserPinnedId } from '../auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { generateScratchPath, generateUserPath } from '../../common/routePaths';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import { pushNotification } from '../notification/notificationSlice';
import { openReplyModal, openRescratchModal } from '../modal/modalSlice';
import { useLayoutEffect, useRef, useState } from 'react';
import avatar from '../../images/avatarplaceholder.png';
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
import { format, parseISO } from 'date-fns';
import {
  addRescratch,
  bookmarkScratch,
  likeScratch,
  pinScratch,
  removeScratch,
  selectScratchById,
  unbookmarkScratch,
  undoAddRescratch,
  unlikeScratch,
  unpinScratch,
} from '../scratches/scratchesSlice';

const ScratchMainPost = ({
  scratchId,
  ScratchIdToRedirectOnDelete,
}: {
  scratchId: number;
  ScratchIdToRedirectOnDelete: number | null;
}) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);
  const userPinnedId = useAppSelector(selectAuthUserPinnedId);
  const scratch = useAppSelector((state) =>
    selectScratchById(state, scratchId)
  );
  const navigate = useNavigate();

  const [moreOptionsToggle, setMoreOptionsToggle] = useState(false);
  const [rescratchToggle, setRescratchToggle] = useState(false);
  const [shareToggle, setShareToggle] = useState(false);

  const mainScratchRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (mainScratchRef.current) {
      mainScratchRef.current.scrollIntoView();
    }
  }, [mainScratchRef]);

  const createdAtDate = parseISO(scratch.createdAt);
  const userPath = generateUserPath({ username: scratch.author.username });
  const scratchPath = generateScratchPath({
    username: scratch.author.username,
    id: scratch.id,
  });

  return (
    <div
      ref={mainScratchRef}
      className="border-b border-primary scroll-mt-12 px-4 pt-2 w-full"
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden mt-1 shrink-0">
          <Link to={userPath}>
            <img src={scratch.author.profileImageUrl || avatar} alt="avatar" />
          </Link>
        </div>
        <div className="min-w-0 grow">
          <div className="flex justify-between gap-3">
            <div className="text-secondary flex items-baseline min-w-0">
              <Link className="truncate flex flex-col" to={userPath}>
                <span className="font-bold text-primary hover:underline">
                  {scratch.author.name}
                </span>
                <span className="text-sm">@{scratch.author.username}</span>
              </Link>
            </div>
            {userId === scratch.authorId && (
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
                    !moreOptionsToggle && 'hidden'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoreOptionsToggle(false);
                  }}
                ></div>
                <div
                  className={`absolute top-0 right-0 bg-neutral flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
                    !moreOptionsToggle && 'hidden'
                  }`}
                >
                  <button
                    className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 flex items-center gap-3 text-delete"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const res = await dispatch(
                        removeScratch({ id: scratch.id })
                      );
                      if (removeScratch.fulfilled.match(res)) {
                        if (ScratchIdToRedirectOnDelete) {
                          navigate(
                            generateScratchPath({
                              username: scratch.author.username,
                              id: ScratchIdToRedirectOnDelete,
                            })
                          );
                        } else {
                          navigate('/');
                        }
                      }
                      setMoreOptionsToggle(false);
                    }}
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                  <button
                    className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 flex items-center gap-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (userPinnedId === scratch.id) {
                        dispatch(unpinScratch({ id: scratch.id }));
                      } else {
                        dispatch(pinScratch({ id: scratch.id }));
                      }
                      setMoreOptionsToggle(false);
                    }}
                  >
                    <Paperclip size={16} />
                    <span>
                      {userPinnedId === scratch.id
                        ? 'Unpin from your profile'
                        : 'Pin to your profile'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-3 text-lg">
        <p className="break-words whitespace-pre-wrap">{scratch.body}</p>
        {scratch.rescratchType === 'quote' && scratch.rescratchedId && (
          <EmbeddedRescratch rescratchedId={scratch.rescratchedId} />
        )}
      </div>
      <div className="my-3 whitespace-nowrap text-secondary text-sm">
        <span className="hover:underline">
          {format(createdAtDate, 'h:mm a · d MMM y')}
        </span>
      </div>
      {(scratch.rescratchCount > 0 || scratch.likeCount > 0) && (
        <div className="border-t border-primary py-3 flex gap-3 text-sm">
          {scratch.rescratchCount > 0 && (
            <div>
              <span className="font-bold">{scratch.rescratchCount}</span>{' '}
              <span className="text-secondary">Rescratches</span>
            </div>
          )}
          {scratch.likeCount > 0 && (
            <div>
              <span className="font-bold">{scratch.likeCount}</span>{' '}
              <span className="text-secondary">Likes</span>
            </div>
          )}
        </div>
      )}
      <div className="border-t border-primary py-3 flex justify-around">
        <div>
          <button
            className="text-secondary transition-colors hover:text-post-btn-default group"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(openReplyModal({ parentId: scratch.id }));
            }}
          >
            <div className="relative mr-3" title="Reply">
              <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors group-hover:bg-blue/10"></div>
              <MessageCircle size={20} className="stroke-current" />
            </div>
          </button>
        </div>
        <div className="relative">
          <button
            className={`${
              scratch.isRescratched
                ? 'text-post-btn-green'
                : 'text-secondary transition-colors hover:text-post-btn-green'
            } group`}
            onClick={(e) => {
              e.stopPropagation();
              setRescratchToggle(true);
            }}
          >
            <div className="relative mr-3" title="Rescratch">
              <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors group-hover:bg-blue/10"></div>
              <Repeat size={20} className="stroke-current" />
            </div>
          </button>
          <div
            className={`fixed top-0 right-0 bottom-0 left-0 cursor-auto z-20 ${
              !rescratchToggle && 'hidden'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setRescratchToggle(false);
            }}
          ></div>
          <div
            className={`absolute top-0 right-0 bg-neutral flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
              !rescratchToggle && 'hidden'
            }`}
          >
            <button
              className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 flex items-center gap-3"
              onClick={(e) => {
                e.stopPropagation();
                if (scratch.isRescratched) {
                  dispatch(undoAddRescratch({ id: scratch.id }));
                } else {
                  dispatch(addRescratch({ rescratchedId: scratch.id }));
                }
                setRescratchToggle(false);
              }}
            >
              <Repeat size={16} />
              <span>
                {scratch.isRescratched ? 'Undo Rescratch' : 'Rescratch'}
              </span>
            </button>
            <button
              className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 flex items-center gap-3"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(openRescratchModal({ rescratchedId: scratch.id }));
                setRescratchToggle(false);
              }}
            >
              <Edit2 size={16} />
              <span>Quote Scratch</span>
            </button>
          </div>
        </div>
        <div>
          <button
            className={`${
              scratch.isLiked
                ? 'text-post-btn-red'
                : 'text-secondary transition-colors hover:text-post-btn-red'
            } group`}
            onClick={(e) => {
              e.stopPropagation();
              if (scratch.isLiked) {
                dispatch(unlikeScratch({ id: scratch.id }));
              } else {
                dispatch(likeScratch({ id: scratch.id }));
              }
            }}
          >
            <div className="relative mr-3" title="Like">
              <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors group-hover:bg-blue/10"></div>
              <Heart
                size={20}
                className={`stroke-current ${
                  scratch.isLiked && 'fill-current'
                }`}
              />
            </div>
          </button>
        </div>
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
              <Share size={20} className="stroke-current" />
            </div>
          </button>
          <div
            className={`fixed top-0 right-0 bottom-0 left-0 cursor-auto z-20 ${
              !shareToggle && 'hidden'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setShareToggle(false);
            }}
          ></div>
          <div
            className={`absolute top-0 right-0 bg-neutral flex flex-col shadow rounded-md z-30 overflow-hidden text-sm ${
              !shareToggle && 'hidden'
            }`}
          >
            {userId && (
              <button
                className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 flex items-center gap-3"
                onClick={(e) => {
                  e.stopPropagation();
                  if (scratch.isBookmarked) {
                    dispatch(unbookmarkScratch({ id: scratch.id }));
                  } else {
                    dispatch(bookmarkScratch({ id: scratch.id }));
                  }
                  setShareToggle(false);
                }}
              >
                <Bookmark size={16} />
                <span>
                  {scratch.isBookmarked
                    ? 'Remove scratch from bookmarks'
                    : 'Add scratch to bookmarks'}
                </span>
              </button>
            )}
            <button
              className="whitespace-nowrap p-4 bg-neutral transition-colors hover:bg-primary/5 flex items-center gap-3"
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
      </div>
    </div>
  );
};

export default ScratchMainPost;
