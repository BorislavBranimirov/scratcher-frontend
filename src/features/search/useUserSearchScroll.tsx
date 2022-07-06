import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useInfiniteScroll from '../../common/useInfiniteScroll';
import {
  loadMoreOfUserSearch,
  selectSearchIsFinished,
  selectSearchIsLoadingMore,
  selectSearchLastUser,
} from './searchSlice';

function useUserSearchScroll() {
  const dispatch = useAppDispatch();
  const lastUser = useAppSelector(selectSearchLastUser);
  const isLoadingMore = useAppSelector(selectSearchIsLoadingMore);
  const isFinished = useAppSelector(selectSearchIsFinished);

  const handleLoadMore = () => {
    dispatch(loadMoreOfUserSearch({ after: lastUser.username }));
  };

  useInfiniteScroll(isFinished, isLoadingMore, handleLoadMore);
}

export default useUserSearchScroll;
