import { useAppSelector } from '../../app/hooks';
import ScratchPost from './ScratchPost';
import { selectScratchParentChainIds } from './scratchPageSlice';

const ScratchParentChain = () => {
  const parentChainIds = useAppSelector(selectScratchParentChainIds);

  return (
    <div>
      Parent chain
      {parentChainIds.map((scratchId) => {
        return <ScratchPost key={scratchId} scratchId={scratchId} />;
      })}
    </div>
  );
};

export default ScratchParentChain;
