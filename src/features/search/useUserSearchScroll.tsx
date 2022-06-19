import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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

  const handleScroll = useCallback(() => {
    if (
      !isFinished &&
      !isLoadingMore &&
      Math.floor(document.documentElement.scrollTop + window.innerHeight) >=
        document.documentElement.scrollHeight - 100
    ) {
      dispatch(loadMoreOfUserSearch({ after: lastUser.username }));
    }
  }, [dispatch, lastUser, isFinished, isLoadingMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
}

export default useUserSearchScroll;
