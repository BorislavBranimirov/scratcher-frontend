import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import SuggestedUsersList from './SuggestedUsersList';
import {
  loadSuggestedUsers,
  selectSuggestedUsersIsLoading,
} from './suggestedUsersSlice';

const SuggestedUsersPage = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectSuggestedUsersIsLoading);
  const history = useHistory();

  useEffect(() => {
    dispatch(loadSuggestedUsers({ limit: 10 }));
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        onClick={() => {
          history.goBack();
        }}
      >
        {'<-'}
      </button>
      <span>Connect</span>
      <hr />
      Suggested for you
      <SuggestedUsersList extended={true} />
    </div>
  );
};

export default SuggestedUsersPage;
