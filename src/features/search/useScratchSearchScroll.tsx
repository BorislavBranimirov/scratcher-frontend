import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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

  const handleScroll = useCallback(() => {
    let yCoordinateToLoadMoreOn: number;

    const bottomOffsetElement = document.getElementById(
      'page-layout-content-offset'
    );
    // if offset element exists, load more once it's reached
    // otherwise, load more once bottom of page is reached
    if (bottomOffsetElement) {
      yCoordinateToLoadMoreOn =
        bottomOffsetElement.getBoundingClientRect().top + window.scrollY - 100;
    } else {
      yCoordinateToLoadMoreOn = document.documentElement.scrollHeight - 100;
    }

    if (
      !isFinished &&
      !isLoadingMore &&
      Math.floor(document.documentElement.scrollTop + window.innerHeight) >=
        yCoordinateToLoadMoreOn
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
