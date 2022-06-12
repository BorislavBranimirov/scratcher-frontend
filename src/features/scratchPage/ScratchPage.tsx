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
import SuggestedUsersWindow from '../suggestedUsers/SuggestedUsersWindow';

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
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        <Loader size={32} className="animate-spin-slow w-full mx-auto mt-10" />
      </div>
    );
  }

  if (!scratchId) {
    return (
      <div className="mt-10 w-max">
        <h2 className="text-lg font-bold">Scratch not found</h2>
      </div>
    );
  }

  return (
    <>
      <ScratchRedirect scratchId={scratchId} />
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
          {parentChainIds.length === 0 ? (
            <h2 className="text-lg font-bold leading-6">Scratch</h2>
          ) : (
            <h2 className="text-lg font-bold leading-6">Thread</h2>
          )}
        </div>
        <ScratchParentChain />
        <ScratchMainPostWrapper scratchId={scratchId} />
        <ScratchSubmit parentScratchId={scratchId} />
        <ScratchReplies parentScratchId={scratchId} />
      </div>
      <div className="hidden lg:block lg:ml-6 lg:col-span-3 lg:mr-12 xl:mr-0">
        <SuggestedUsersWindow />
      </div>
    </>
  );
};

export default ScratchPage;
