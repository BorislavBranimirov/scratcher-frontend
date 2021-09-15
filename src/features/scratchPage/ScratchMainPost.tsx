import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Author } from '../../common/types';
import {
  likeScratch,
  pinScratch,
  bookmarkScratch,
  unbookmarkScratch,
  unlikeScratch,
  unpinScratch,
  removeScratch,
  undoAddRescratch,
  addRescratch,
  selectScratchById,
} from './scratchPageSlice';
import { selectAuthUser } from '../auth/authSlice';
import { Link, useHistory } from 'react-router-dom';
import { generateScratchPath, generateUserPath } from '../../common/routePaths';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import { pushNotification } from '../notification/notificationSlice';
import { openReplyModal, openRescratchModal } from '../modal/modalSlice';

const ScratchMainPost = ({
  scratchId,
  rescratchAuthor,
}: {
  scratchId: number;
  rescratchAuthor?: Author;
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const scratch = useAppSelector((state) =>
    selectScratchById(state, scratchId)
  );
  const history = useHistory();

  const bookmarkButton = scratch.isBookmarked ? (
    <li>
      <button
        onClick={() => {
          dispatch(unbookmarkScratch({ id: scratch.id }));
        }}
      >
        Unbookmark
      </button>
    </li>
  ) : (
    <li>
      <button
        onClick={() => {
          dispatch(bookmarkScratch({ id: scratch.id }));
        }}
      >
        Bookmark
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
          Unpin
        </button>
      </li>
    ) : (
      <li>
        <button
          onClick={() => {
            dispatch(pinScratch({ id: scratch.id }));
          }}
        >
          Pin
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
      Main scratch
      {rescratchAuthor && (
        <div>
          <Link to={generateUserPath({ username: rescratchAuthor.username })}>
            {rescratchAuthor.name} Rescratched
          </Link>
        </div>
      )}
      <p>
        <Link to={userPath}>{scratch.author.name}</Link>
      </p>
      <p>@{scratch.author.username}</p>
      {user?.id === scratch.authorId && (
        <button
          onClick={async () => {
            const res = await dispatch(removeScratch({ id: scratch.id }));
            if (removeScratch.fulfilled.match(res)) {
              history.goBack();
            }
          }}
        >
          Delete
        </button>
      )}
      <p>{scratch.body}</p>
      {scratch.rescratchType === 'quote' && scratch.rescratchedId && (
        <EmbeddedRescratch
          rescratchedId={scratch.rescratchedId}
          selector={selectScratchById}
        />
      )}
      <p>{scratch.createdAt}</p>
      <p>---</p>
      <span>{scratch.rescratchCount} Rescratches</span>{' '}
      <span>{scratch.likeCount} Likes</span>
      <p>---</p>
      <ul>
        <li>reply:</li>
        <li>rescratch:{'' + scratch.isRescratched}</li>
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

export default ScratchMainPost;
