import HomePosts from './HomePosts';
import HomeScratchSubmit from './HomeScratchSubmit';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadHomeTimeline, selectTimelineIsLoading } from './timelineSlice';
import PageLayout from '../../common/PageLayout';

const Home = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectTimelineIsLoading);

  useEffect(() => {
    dispatch(loadHomeTimeline());
  }, [dispatch]);

  return (
    <PageLayout isLoading={isLoading}>
      <div className="sticky top-0 bg-primary border-b border-primary px-4 py-3 z-10">
        <h2 className="text-lg font-bold leading-6">Latest Scratches</h2>
      </div>
      <HomeScratchSubmit />
      <HomePosts />
    </PageLayout>
  );
};

export default Home;
