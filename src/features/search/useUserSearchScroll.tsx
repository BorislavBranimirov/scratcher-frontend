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
