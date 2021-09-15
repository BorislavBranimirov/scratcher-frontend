import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  loadHomeTimeline,
  loadMoreOfTimeline,
  selectTimelineIds,
  selectTimelineIsFinished,
  selectTimelineIsLoading,
} from '../../features/timeline/timelineSlice';
import PostWrapper from './PostWrapper';

const HomePosts = () => {
  const dispatch = useAppDispatch();
  const ids = useAppSelector(selectTimelineIds);
  const isFinished = useAppSelector(selectTimelineIsFinished);
  const isLoading = useAppSelector(selectTimelineIsLoading);

  useEffect(() => {
    dispatch(loadHomeTimeline());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      {ids.map((id) => {
        return <PostWrapper key={id} scratchId={id} />;
      })}
    </div>
  );
};

export default HomePosts;
