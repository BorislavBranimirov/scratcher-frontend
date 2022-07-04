import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ScratchParentChain from './ScratchParentChain';
import ScratchReplies from './ScratchReplies';
import {
  loadScratchConversation,
  selectScratchIsLoading,
  selectScratchMainScratchId,
  selectScratchParentChainIds,
} from './scratchPageSlice';
import ScratchSubmit from './scratchPageSubmit';
import ScratchMainPostWrapper from './ScratchMainPostWrapper';
import ScratchRedirect from './ScratchRedirect';
import { ArrowLeft, Loader } from 'react-feather';
import PageLayout from '../../common/PageLayout';

const ScratchPage = () => {
  const dispatch = useAppDispatch();
  const scratchId = useAppSelector(selectScratchMainScratchId);
  const parentChainIds = useAppSelector(selectScratchParentChainIds);
  const isLoading = useAppSelector(selectScratchIsLoading);

  const { id } = useParams() as { username: string; id: string };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadScratchConversation({ id: parseInt(id, 10) }));
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <PageLayout omitBottomOffset>
        <Loader size={32} className="animate-spin-slow w-full mx-auto mt-10" />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
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
        <h2 className="text-lg font-bold leading-6">
          {parentChainIds.length === 0 ? 'Scratch' : 'Thread'}
        </h2>
      </div>
      {scratchId ? (
        <>
          <ScratchRedirect scratchId={scratchId} />
          <ScratchParentChain />
          <ScratchMainPostWrapper scratchId={scratchId} />
          <ScratchSubmit parentScratchId={scratchId} />
          <ScratchReplies parentScratchId={scratchId} />
        </>
      ) : (
        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold">Scratch not found</h2>
          <p className="text-sm text-muted">
            It doesn't exist or was deleted.
          </p>
        </div>
      )}
    </PageLayout>
  );
};

export default ScratchPage;
