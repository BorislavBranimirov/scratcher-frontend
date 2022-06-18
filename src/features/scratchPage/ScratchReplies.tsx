import { useAppSelector } from '../../app/hooks';
import ScratchRepliesPost from './ScratchRepliesPost';
import { selectScratchReplyIds } from './scratchPageSlice';
import { selectScratchById } from '../scratches/scratchesSlice';

const ScratchReplies = ({ parentScratchId }: { parentScratchId: number }) => {
  const parentScratch = useAppSelector((state) =>
    selectScratchById(state, parentScratchId)
  );
  const replyIds = useAppSelector(selectScratchReplyIds);

  return (
    <div>
      {replyIds.map((scratchId) => {
        return (
          <ScratchRepliesPost
            key={scratchId}
            scratchId={scratchId}
            parentUsername={parentScratch.author.username}
          />
        );
      })}
    </div>
  );
};

export default ScratchReplies;
