import { useEffect } from 'react';
import { ArrowLeft } from 'react-feather';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageLayout from '../../common/PageLayout';
import { searchPagePathValue } from '../../common/routePaths';
import SearchPageTabs from './SearchPageTabs';
import {
  loadScratchSearch,
  loadUserSearch,
  selectSearchIsLoading,
} from './searchSlice';
import SearchPageUsersList from './SearchPageUsersList';
import SearchPagePosts from './SearchPagePosts';
import SearchInput from '../../common/SearchInput';

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectSearchIsLoading);

  const { searchTab } = useParams() as {
    searchTab: searchPagePathValue;
  };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const searchPattern = searchParams.get('q') || '';

    if (searchTab === 'scratches') {
      dispatch(loadScratchSearch({ searchPattern }));
    } else if (searchTab === 'users') {
      dispatch(loadUserSearch({ searchPattern }));
    } else {
      navigate('/home', { replace: true });
    }
  }, [dispatch, navigate, searchParams, searchTab]);

  return (
    <PageLayout isSoftLoading={isLoading} omitSearchWindow>
      <div className="sticky top-0 bg-primary border-b border-primary px-4 pr-24 sm:pr-4 py-3 z-10 flex items-center">
        <button
          className="h-full mr-4"
          data-cy="header-back-btn"
          onClick={() => {
            navigate(-1);
          }}
        >
          <div className="relative" title="Back">
            <div className="absolute inset-0 -m-2 rounded-full transition-colors hover:bg-hover-2 active:bg-hover-3"></div>
            <ArrowLeft size={16} />
          </div>
        </button>
        <SearchInput />
      </div>
      <SearchPageTabs />
      {searchTab === 'scratches' && <SearchPagePosts />}
      {searchTab === 'users' && <SearchPageUsersList />}
    </PageLayout>
  );
};

export default SearchPage;
