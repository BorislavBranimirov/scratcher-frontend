import { useEffect } from 'react';
import { ArrowLeft, Loader } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import SuggestedUsersList from './SuggestedUsersList';
import {
  loadSuggestedUsers,
  selectSuggestedUsersIsLoading,
} from './suggestedUsersSlice';

const SuggestedUsersPage = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectSuggestedUsersIsLoading);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadSuggestedUsers({ limit: 10 }));
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
        <div className="sticky top-0 bg-neutral border-b border-primary px-4 py-3 z-10 flex items-center">
          <button
            className="h-full mr-4"
            onClick={() => {
              navigate(-1);
            }}
          >
            <div className="relative" title="Back">
              <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors hover:bg-primary/10 active:bg-primary/20"></div>
              <ArrowLeft size={16} />
            </div>
          </button>
          <h2 className="text-lg font-bold leading-6">Connect</h2>
        </div>
        <h2 className="text-lg font-bold leading-6 p-3">Suggested for you</h2>
        <SuggestedUsersList extended={true} />
      </div>
    </>
  );
};

export default SuggestedUsersPage;
