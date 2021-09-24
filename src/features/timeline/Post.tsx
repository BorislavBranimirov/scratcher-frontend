import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Author } from '../../common/types';
import {
  bookmarkScratch,
  likeScratch,
  pinScratch,
  removeScratch,
  addRescratch,
  unbookmarkScratch,
  undoAddRescratch,
  unlikeScratch,
  unpinScratch,
  selectTimelineScratchById,
} from './timelineSlice';
import { selectAuthUser } from '../auth/authSlice';
import { Link } from 'react-router-dom';
import { generateScratchPath, generateUserPath } from '../../common/routePaths';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import { pushNotification } from '../notification/notificationSlice';
import { openReplyModal, openRescratchModal } from '../modal/modalSlice';

const Post = ({
  scratchId,
  rescratchAuthor,
}: {
  scratchId: number;
  rescratchAuthor?: Author;
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const scratch = useAppSelector((state) =>
    selectTimelineScratchById(state, scratchId)
  );

  if (!scratch) {
    return <div>Scratch not found</div>;
  }

  const bookmarkButton = scratch.isBookmarked ? (
    <li>
      <button
        onClick={() => {
          dispatch(unbookmarkScratch({ id: scratch.id }));
        }}
      >
        Remove scratch from bookmarks
      </button>
    </li>
  ) : (
    <li>
      <button
        onClick={() => {
          dispatch(bookmarkScratch({ id: scratch.id }));
        }}
      >
        Add scratch to bookmarks
      </button>
    </li>
  );

  const pinButton =
    user?.pinnedId === scratch.id ? (
      <li>
        <button
          onClick={() => {
            dispatch(unpinScratch({ id: scratch.id }));
          }}
        >
          Unpin from your profile
        </button>
      </li>
    ) : (
      <li>
        <button
          onClick={() => {
            dispatch(pinScratch({ id: scratch.id }));
          }}
        >
          Pin to your profile
        </button>
      </li>
    );

  const userPath = generateUserPath({ username: scratch.author.username });
  const scratchPath = generateScratchPath({
    username: scratch.author.username,
    id: scratch.id,
  });

  return (
    <div>
      {rescratchAuthor && (
        <div>
          <Link to={generateUserPath({ username: rescratchAuthor.username })}>
            {rescratchAuthor.name} Rescratched
          </Link>
        </div>
      )}
      <p>
        <Link to={userPath}>{scratch.author.name}</Link>@
        {scratch.author.username}
        {scratch.createdAt}
      </p>
      {user?.id === scratch.authorId && (
        <button
          onClick={() => {
            dispatch(removeScratch({ id: scratch.id }));
          }}
        >
          Delete
        </button>
      )}
      <p>{scratch.body}</p>
      {scratch.rescratchType === 'quote' && scratch.rescratchedId && (
        <EmbeddedRescratch
          rescratchedId={scratch.rescratchedId}
          selector={selectTimelineScratchById}
        />
      )}
      <ul>
        <li>reply:{scratch.replyCount}</li>
        <li>
          rescratch:{scratch.rescratchCount} {'' + scratch.isRescratched}
        </li>
        <li>
          <button
            onClick={() => {
              dispatch(openReplyModal({ parentId: scratch.id }));
            }}
          >
            Reply
          </button>
        </li>
        {scratch.isRescratched ? (
          <li>
            <button
              onClick={() => {
                dispatch(undoAddRescratch({ id: scratch.id }));
              }}
            >
              Undo Rescratch
            </button>
          </li>
        ) : (
          <li>
            <button
              onClick={() => {
                dispatch(addRescratch({ rescratchedId: scratch.id }));
              }}
            >
              Rescratch
            </button>
          </li>
        )}
        <li>
          <button
            onClick={() => {
              dispatch(openRescratchModal({ rescratchedId: scratch.id }));
            }}
          >
            Quote Scratch
          </button>
        </li>
        {scratch.isLiked ? (
          <li>
            <button
              onClick={() => {
                dispatch(unlikeScratch({ id: scratch.id }));
              }}
            >
              {scratch.isLiked ? 'unlike' : 'like'}
            </button>
            {scratch.likeCount}
          </li>
        ) : (
          <li>
            <button
              onClick={() => {
                dispatch(likeScratch({ id: scratch.id }));
              }}
            >
              {scratch.isLiked ? 'unlike' : 'like'}
            </button>
            {scratch.likeCount}
          </li>
        )}
        {user && bookmarkButton}
      </ul>
      <button
        onClick={() => {
          const scratchUrl = window.location.origin + scratchPath;
          navigator.clipboard.writeText(scratchUrl);
          dispatch(pushNotification('Copied to clipboard'));
        }}
      >
        Copy link to scratch
      </button>
      <Link to={scratchPath}>Go to scratch</Link>
      {user?.id === scratch.authorId && pinButton}
      <hr />
    </div>
  );
};

export default Post;
