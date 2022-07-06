import { useCallback, useEffect } from 'react';

const useInfiniteScroll = (
  isFinished: boolean,
  isLoadingMore: boolean,
  handleLoadMore: () => void
) => {
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
      handleLoadMore();
    }
  }, [handleLoadMore, isFinished, isLoadingMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
};

export default useInfiniteScroll;
