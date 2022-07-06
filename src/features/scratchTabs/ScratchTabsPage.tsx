import { useEffect } from 'react';
import { ArrowLeft } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageLayout from '../../common/PageLayout';
import {
  generateScratchPath,
  scratchPageTabValue,
} from '../../common/routePaths';
import ScratchTabRedirect from './ScratchTabRedirect';
import {
  loadScratchLikedUsers,
  loadScratchRescratchedUsers,
  selectScratchTabIsLoading,
  selectScratchTabScratchId,
} from './scratchTabSlice';
import ScratchTabsUsersList from './ScratchTabsUsersList';

const ScratchTabsPage = () => {
  const dispatch = useAppDispatch();
  const scratchId = useAppSelector(selectScratchTabScratchId);
  const isLoading = useAppSelector(selectScratchTabIsLoading);

  const { username, id, tab } = useParams() as {
    username: string;
    id: string;
    tab: scratchPageTabValue;
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === 'rescratches') {
      dispatch(loadScratchRescratchedUsers({ id: parseInt(id, 10) }));
    } else if (tab === 'likes') {
      dispatch(loadScratchLikedUsers({ id: parseInt(id, 10) }));
    } else {
      navigate(
        generateScratchPath({
          username: username,
          id: parseInt(id, 10),
        })
      );
    }
  }, [dispatch, navigate, username, id, tab]);

  let headerText = 'Scratch';
  if (tab === 'rescratches') {
    headerText = 'Rescratched by';
  } else if (tab === 'likes') {
    headerText = 'Liked by';
  }

  return (
    <PageLayout isLoading={isLoading}>
      <div className="sticky top-0 bg-primary border-b border-primary px-4 py-3 z-10 flex items-center">
        <button
          className="h-full mr-4"
          onClick={() => {
            navigate(
              generateScratchPath({
                username: username,
                id: parseInt(id, 10),
              })
            );
          }}
        >
          <div className="relative" title="Back">
            <div className="absolute inset-0 -m-2 rounded-full transition-colors hover:bg-hover-2 active:bg-hover-3"></div>
            <ArrowLeft size={16} />
          </div>
        </button>
        <h2 className="text-lg font-bold leading-6">{headerText}</h2>
      </div>
      {scratchId ? (
        <>
          <ScratchTabRedirect scratchId={scratchId} />
          <ScratchTabsUsersList />
        </>
      ) : (
        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold">Scratch not found</h2>
          <p className="text-sm text-muted">It doesn't exist or was deleted.</p>
        </div>
      )}
    </PageLayout>
  );
};

export default ScratchTabsPage;
