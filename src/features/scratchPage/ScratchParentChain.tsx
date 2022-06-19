import { useAppSelector } from '../../app/hooks';
import Post from '../scratches/Post';
import { selectScratchParentChainIds } from './scratchPageSlice';
const ScratchParentChain = () => {
  const parentChainIds = useAppSelector(selectScratchParentChainIds);

  return (
    <div>
      {parentChainIds.map((scratchId, index) => {
        return index === 0 ? (
          <Post
            key={scratchId}
            scratchId={scratchId}
            timelineScratch
            redirectOnDelete
          />
        ) : (
          <Post
            key={scratchId}
            scratchId={scratchId}
            timelineScratch
            redirectOnDelete
            ScratchIdToRedirectOnDelete={parentChainIds[index - 1]}
          />
        );
      })}
    </div>
  );
};

export default ScratchParentChain;
