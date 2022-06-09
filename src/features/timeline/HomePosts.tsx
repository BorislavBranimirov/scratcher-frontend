import { useAppSelector } from '../../app/hooks';
import useTimelineScroll from '../../common/useTimelineScroll';
import { selectTimelineIds } from '../../features/timeline/timelineSlice';
import PostWrapper from './PostWrapper';

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
