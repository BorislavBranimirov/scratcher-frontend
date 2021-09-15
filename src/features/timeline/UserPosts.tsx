import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  loadMoreOfTimeline,
  selectTimelineIds,
  selectTimelineIsFinished,
  selectTimelinePinnedScratchId,
} from './timelineSlice';
import Post from './Post';
import PostWrapper from './PostWrapper';

const UserPosts = () => {
  const dispatch = useAppDispatch();
  const pinnedScratchId = useAppSelector(selectTimelinePinnedScratchId);
  const ids = useAppSelector(selectTimelineIds);
  const isFinished = useAppSelector(selectTimelineIsFinished);

  return (
    <div>
      <p>Posts</p>
      <button
        onClick={() => {
          if (!isFinished) {
            dispatch(loadMoreOfTimeline({ after: ids[ids.length - 1] }));
          }
        }}
      >
        Load more
      </button>
      <p>PINNED</p>
      {pinnedScratchId && <Post scratchId={pinnedScratchId} />}
      <p>/PINNED</p>
      {ids.map((id) => {
        return <PostWrapper key={id} scratchId={id} />;
      })}
    </div>
  );
};

export default UserPosts;
