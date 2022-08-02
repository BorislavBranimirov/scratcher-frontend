import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useInfiniteScroll from '../../common/useInfiniteScroll';
import {
  loadMoreOfTimeline,
  selectTimelineIsFinished,
  selectTimelineIsLoadingMore,
  selectTimelineLastScratchId,
} from './timelineSlice';

function useTimelineScroll() {
  const dispatch = useAppDispatch();
  const lastId = useAppSelector(selectTimelineLastScratchId);
  const isLoadingMore = useAppSelector(selectTimelineIsLoadingMore);
  const isFinished = useAppSelector(selectTimelineIsFinished);

  const handleLoadMore = () => {
    if (lastId) {
      dispatch(loadMoreOfTimeline({ after: lastId }));
    }
  };

  useInfiniteScroll(isFinished, isLoadingMore, handleLoadMore);
}

export default useTimelineScroll;
