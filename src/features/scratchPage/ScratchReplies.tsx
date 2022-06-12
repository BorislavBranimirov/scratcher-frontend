import { useAppSelector } from '../../app/hooks';
import ScratchRepliesPost from './ScratchRepliesPost';
import { selectScratchById, selectScratchReplyIds } from './scratchPageSlice';

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
