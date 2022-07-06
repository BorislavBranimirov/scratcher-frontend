import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useInfiniteScroll from '../../common/useInfiniteScroll';
import {
  loadMoreOfBookmarks,
  selectBookmarksIsFinished,
  selectBookmarksIsLoadingMore,
  selectBookmarksLastId,
} from './bookmarksSlice';

function useBookmarksScroll() {
  const dispatch = useAppDispatch();
  const lastId = useAppSelector(selectBookmarksLastId);
  const isLoadingMore = useAppSelector(selectBookmarksIsLoadingMore);
  const isFinished = useAppSelector(selectBookmarksIsFinished);

  const handleLoadMore = () => {
    dispatch(loadMoreOfBookmarks({ after: lastId }));
  };

  useInfiniteScroll(isFinished, isLoadingMore, handleLoadMore);
}

export default useBookmarksScroll;
