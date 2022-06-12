import { useAppSelector } from '../../app/hooks';
import { selectScratchParentChainIds } from './scratchPageSlice';
import ScratchParentPost from './ScratchParentPost';

const ScratchParentChain = () => {
  const parentChainIds = useAppSelector(selectScratchParentChainIds);

  return (
    <div>
      {parentChainIds.map((scratchId, index) => {
        return (
          <ScratchParentPost
            key={scratchId}
            scratchId={scratchId}
            ScratchIdToRedirectOnDelete={
              index === 0 ? null : parentChainIds[index - 1]
            }
          />
        );
      })}
    </div>
  );
};

export default ScratchParentChain;
