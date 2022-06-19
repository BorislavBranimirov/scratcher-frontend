import { useAppSelector } from '../../app/hooks';
import {
  selectTimelineIds,
  selectTimelinePinnedScratchId,
} from './timelineSlice';
import PostWrapper from './PostWrapper';
import useTimelineScroll from '../../common/useTimelineScroll';
import Post from '../scratches/Post';

const UserPagePosts = () => {
  const pinnedScratchId = useAppSelector(selectTimelinePinnedScratchId);
  const ids = useAppSelector(selectTimelineIds);

  useTimelineScroll();

  return (
    <div>
      {pinnedScratchId && <Post scratchId={pinnedScratchId} pinned />}
      {ids.map((id) => {
        return <PostWrapper key={id} scratchId={id} />;
      })}
    </div>
  );
};

export default UserPagePosts;
