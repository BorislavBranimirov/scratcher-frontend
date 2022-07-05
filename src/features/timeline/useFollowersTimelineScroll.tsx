import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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
      dispatch(loadMoreOfUserFollowers({ after: lastId }));
    }
  }, [dispatch, lastId, isFinished, isLoadingMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
}

export default useFollowersTimelineScroll;
