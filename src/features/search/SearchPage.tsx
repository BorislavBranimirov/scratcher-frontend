import { useEffect } from 'react';
import { ArrowLeft, Loader } from 'react-feather';
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

  const { tab } = useParams() as {
    tab: searchPagePathValue;
  };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const searchPattern = searchParams.get('q') || '';

    if (tab === 'scratches') {
      dispatch(loadScratchSearch({ searchPattern }));
    } else if (tab === 'users') {
      dispatch(loadUserSearch({ searchPattern }));
    } else {
      navigate('/', { replace: true });
    }
  }, [dispatch, navigate, searchParams, tab]);

  if (isLoading) {
    return (
      <PageLayout omitSearchWindow>
        <Loader size={32} className="animate-spin-slow w-full mx-auto mt-10" />
      </PageLayout>
    );
  }

  return (
    <PageLayout omitSearchWindow>
      <div className="sticky top-0 bg-primary border-b border-primary px-4 pr-24 sm:pr-4 py-3 z-10 flex items-center">
        <button
          className="h-full mr-4"
          onClick={() => {
            navigate(-1);
          }}
        >
          <div className="relative" title="Back">
            <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors hover:bg-hover-2 active:bg-hover-3"></div>
            <ArrowLeft size={16} />
          </div>
        </button>
        <SearchInput />
      </div>
      <SearchPageTabs />
      {tab === 'scratches' && <SearchPagePosts />}
      {tab === 'users' && <SearchPageUsersList />}
    </PageLayout>
  );
};

export default SearchPage;
