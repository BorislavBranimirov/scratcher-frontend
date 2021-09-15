import { useAppSelector } from '../../app/hooks';
import ScratchMainPost from './ScratchMainPost';
import { selectScratchById } from './scratchPageSlice';

const ScratchMainPostWrapper = ({ scratchId }: { scratchId: number }) => {
  const scratch = useAppSelector((state) =>
    selectScratchById(state, scratchId)
  );

  if (scratch.rescratchType === 'direct') {
    return (
      <ScratchMainPost
        scratchId={scratch.rescratchedId}
        rescratchAuthor={scratch.author}
      />
    );
  }

  return <ScratchMainPost scratchId={scratchId} />;
};

export default ScratchMainPostWrapper;
