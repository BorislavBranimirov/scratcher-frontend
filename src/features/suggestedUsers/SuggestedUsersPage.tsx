import { useEffect } from 'react';
import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageLayout from '../../common/PageLayout';
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

  return (
    <PageLayout isSoftLoading={isLoading} omitSuggestedUsersWindow>
      <div className="sticky top-0 bg-primary border-b border-primary px-4 py-3 z-10 flex items-center">
        <button
          className="h-full mr-4"
          onClick={() => {
            navigate(-1);
          }}
        >
          <div className="relative" title="Back">
            <div className="absolute inset-0 -m-2 rounded-full transition-colors hover:bg-hover-2 active:bg-hover-3"></div>
            <ArrowLeft size={16} />
          </div>
        </button>
        <h2 className="text-lg font-bold leading-6">Connect</h2>
      </div>
      <h2 className="text-lg font-bold leading-6 p-3">Suggested for you</h2>
      <SuggestedUsersList extended={true} />
    </PageLayout>
  );
};

export default SuggestedUsersPage;
