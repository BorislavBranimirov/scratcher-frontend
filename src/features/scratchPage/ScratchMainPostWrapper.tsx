import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { generateScratchPath } from '../../common/routePaths';
import { selectScratchById } from '../scratches/scratchesSlice';
import ScratchMainPost from './ScratchMainPost';
import { selectScratchParentChainIds } from './scratchPageSlice';

const ScratchMainPostWrapper = ({ scratchId }: { scratchId: number }) => {
  const scratch = useAppSelector((state) =>
    selectScratchById(state, scratchId)
  );
  const parentChainIds = useAppSelector(selectScratchParentChainIds);

  if (scratch.rescratchType === 'direct') {
    const rescratchedPath = generateScratchPath({
      username: scratch.author.username,
      id: scratch.rescratchedId,
    });

    return <Navigate to={rescratchedPath} replace />;
  }

  return (
    <ScratchMainPost
      scratchId={scratchId}
      ScratchIdToRedirectOnDelete={
        parentChainIds.length === 0
          ? null
          : parentChainIds[parentChainIds.length - 1]
      }
    />
  );
};

export default ScratchMainPostWrapper;
