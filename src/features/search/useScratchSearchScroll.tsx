import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadMoreOfScratchSearch, selectSearchIsFinished, selectSearchIsLoadingMore, selectSearchLastScratchId } from './searchSlice';

function useScratchSearchScroll() {
  const dispatch = useAppDispatch();
  const lastId = useAppSelector(selectSearchLastScratchId);
  const isLoadingMore = useAppSelector(selectSearchIsLoadingMore);
  const isFinished = useAppSelector(selectSearchIsFinished);

  const handleScroll = useCallback(() => {
    if (
      !isFinished &&
      !isLoadingMore &&
      Math.floor(document.documentElement.scrollTop + window.innerHeight) >=
        document.documentElement.scrollHeight - 100
    ) {
      dispatch(loadMoreOfScratchSearch({ after: lastId }));
    }
  }, [dispatch, lastId, isFinished, isLoadingMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
}

export default useScratchSearchScroll;