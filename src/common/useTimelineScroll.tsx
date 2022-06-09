import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loadMoreOfTimeline,
  selectTimelineIsFinished,
  selectTimelineIsLoadingMore,
  selectTimelineLastId,
} from '../features/timeline/timelineSlice';

function useTimelineScroll() {
  const dispatch = useAppDispatch();
  const lastId = useAppSelector(selectTimelineLastId);
  const isLoadingMore = useAppSelector(selectTimelineIsLoadingMore);
  const isFinished = useAppSelector(selectTimelineIsFinished);

  const handleScroll = useCallback(() => {
    if (
      !isFinished &&
      !isLoadingMore &&
      Math.floor(document.documentElement.scrollTop + window.innerHeight) >=
        document.documentElement.scrollHeight - 100
    ) {
      dispatch(loadMoreOfTimeline({ after: lastId }));
    }
  }, [dispatch, lastId, isFinished, isLoadingMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
}

export default useTimelineScroll;
