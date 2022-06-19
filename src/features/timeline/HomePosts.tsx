import { useAppSelector } from '../../app/hooks';
import useTimelineScroll from './useTimelineScroll';
import { selectTimelineIds } from '../../features/timeline/timelineSlice';
import PostWrapper from '../../common/PostWrapper';

const HomePosts = () => {
  const ids = useAppSelector(selectTimelineIds);

  useTimelineScroll();

  return (
    <div>
      {ids.map((id) => {
        return <PostWrapper key={id} scratchId={id} />;
      })}
    </div>
  );
};

export default HomePosts;
