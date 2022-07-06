import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useInfiniteScroll from '../../common/useInfiniteScroll';
import {
  loadMoreOfScratchSearch,
  selectSearchIsFinished,
  selectSearchIsLoadingMore,
  selectSearchLastScratchId,
} from './searchSlice';

function useScratchSearchScroll() {
  const dispatch = useAppDispatch();
  const lastId = useAppSelector(selectSearchLastScratchId);
  const isLoadingMore = useAppSelector(selectSearchIsLoadingMore);
  const isFinished = useAppSelector(selectSearchIsFinished);

  const handleLoadMore = () => {
    dispatch(loadMoreOfScratchSearch({ after: lastId }));
  };

  useInfiniteScroll(isFinished, isLoadingMore, handleLoadMore);
}

export default useScratchSearchScroll;
