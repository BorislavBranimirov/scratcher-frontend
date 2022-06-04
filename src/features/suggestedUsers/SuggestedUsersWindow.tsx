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
      <h2 className="text-lg font-bold leading-6 pt-3 px-3">Who to follow</h2>
      {isLoading ? (
        <div className="mx-auto py-2">
          <Loader size={32} className="animate-spin-slow w-full" />
        </div>
      ) : (
        <>
          <SuggestedUsersList />
          <Link
            to="/suggested-users"
            className="text-post-btn-default text-sm pt-2 pb-3 px-3 transition-colors duration-200 hover:bg-primary/5"
          >
            Show more
          </Link>
        </>
      )}
    </div>
  );
};

export default SuggestedUsersWindow;
