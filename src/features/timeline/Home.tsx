import HomePosts from './HomePosts';
import HomeScratchSubmit from './HomeScratchSubmit';
import SuggestedUsersWindow from '../suggestedUsers/SuggestedUsersWindow';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadHomeTimeline, selectTimelineIsLoading } from './timelineSlice';
import { Loader } from 'react-feather';

const Home = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectTimelineIsLoading);

  useEffect(() => {
    dispatch(loadHomeTimeline());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        <Loader size={32} className="animate-spin-slow w-full mx-auto mt-10" />
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        <div className="sticky top-0 bg-neutral border-b border-primary px-4 py-3 z-10">
          <h2 className="text-lg font-bold leading-6">Latest Scratches</h2>
        </div>
        <HomeScratchSubmit />
        <HomePosts />
      </div>
      <div className="hidden lg:block lg:ml-6 lg:col-span-3 lg:mr-12 xl:mr-0">
        <SuggestedUsersWindow />
      </div>
    </>
  );
};

export default Home;
