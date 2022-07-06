import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useInfiniteScroll from '../../common/useInfiniteScroll';
import {
  loadMoreOfScratchTab,
  selectScratchTabIsFinished,
  selectScratchTabIsLoadingMore,
  selectScratchTabLastUserId,
} from './scratchTabSlice';

function useScratchTabScroll() {
  const dispatch = useAppDispatch();
  const lastId = useAppSelector(selectScratchTabLastUserId);
  const isLoadingMore = useAppSelector(selectScratchTabIsLoadingMore);
  const isFinished = useAppSelector(selectScratchTabIsFinished);

  const handleLoadMore = () => {
    dispatch(loadMoreOfScratchTab({ after: lastId }));
  };

  useInfiniteScroll(isFinished, isLoadingMore, handleLoadMore);
}

export default useScratchTabScroll;
