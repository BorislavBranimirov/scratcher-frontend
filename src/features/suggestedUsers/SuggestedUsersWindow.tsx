import { useEffect } from 'react';
import { Loader } from 'react-feather';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import SuggestedUsersList from './SuggestedUsersList';
import {
  loadSuggestedUsers,
  selectSuggestedUsersIsLoading,
} from './suggestedUsersSlice';

const SuggestedUsersWindow = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectSuggestedUsersIsLoading);

  useEffect(() => {
    dispatch(loadSuggestedUsers({ limit: 3 }));
  }, [dispatch]);

  return (
    <div className="bg-secondary rounded-2xl overflow-hidden flex flex-col">
      <h2 className="text-lg font-bold leading-6 pt-3 pb-2 px-3">Who to follow</h2>
      {isLoading ? (
        <div className="mx-auto pt-2 pb-4">
          <Loader size={32} className="animate-spin-slow w-full" />
        </div>
      ) : (
        <>
          <SuggestedUsersList />
          <Link
            to="/suggested-users"
            className="text-sm text-accent pt-2 pb-3 px-3 transition-colors duration-200 hover:bg-hover-1"
          >
            Show more
          </Link>
        </>
      )}
    </div>
  );
};

export default SuggestedUsersWindow;
