import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useInfiniteScroll from '../../common/useInfiniteScroll';
import {
  loadMoreOfUserFollowers,
  selectTimelineIsFinished,
  selectTimelineIsLoadingMore,
  selectTimelineLastFollowerId,
} from './timelineSlice';

function useFollowersTimelineScroll() {
  const dispatch = useAppDispatch();
  const lastId = useAppSelector(selectTimelineLastFollowerId);
  const isLoadingMore = useAppSelector(selectTimelineIsLoadingMore);
  const isFinished = useAppSelector(selectTimelineIsFinished);

  const handleLoadMore = () => {
    if (lastId) {
      dispatch(loadMoreOfUserFollowers({ after: lastId }));
    }
  };

  useInfiniteScroll(isFinished, isLoadingMore, handleLoadMore);
}

export default useFollowersTimelineScroll;
