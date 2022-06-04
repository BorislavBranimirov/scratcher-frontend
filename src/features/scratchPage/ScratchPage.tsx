import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ScratchParentChain from './ScratchParentChain';
import ScratchReplies from './ScratchReplies';
import {
  loadScratchConversation,
  selectScratchIsLoading,
  selectScratchMainScratchId,
} from './scratchPageSlice';
import ScratchSubmit from './scratchPageSubmit';
import ScratchMainPostWrapper from './ScratchMainPostWrapper';
import ScratchRedirect from './ScratchRedirect';

const ScratchPage = () => {
  const dispatch = useAppDispatch();
  const scratchId = useAppSelector(selectScratchMainScratchId);
  const isLoading = useAppSelector(selectScratchIsLoading);

  const { id } = useParams() as { username: string; id: string };
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadScratchConversation({ id: parseInt(id, 10) }));
  }, [id, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!scratchId) {
    return <div>Scratch not found</div>;
  }

  return (
    <div>
      <ScratchRedirect scratchId={scratchId} />
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        {'<-'}
      </button>
      <span>Scratch</span>
      <ScratchParentChain />
      <hr />
      <hr />
      <hr />
      <ScratchMainPostWrapper scratchId={scratchId} />
      <hr />
      <hr />
      <hr />
      <ScratchSubmit scratchId={scratchId} />
      <hr />
      <hr />
      <hr />
      <ScratchReplies />
    </div>
  );
};

export default ScratchPage;
