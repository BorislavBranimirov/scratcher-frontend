import { useEffect } from 'react';
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Who to follow
      <SuggestedUsersList />
      <Link to="/suggested-users">Show more</Link>
    </div>
  );
};

export default SuggestedUsersWindow;
