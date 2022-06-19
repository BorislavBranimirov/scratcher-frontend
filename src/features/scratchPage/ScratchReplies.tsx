import { useAppSelector } from '../../app/hooks';
import { selectScratchReplyIds } from './scratchPageSlice';
import { selectScratchById } from '../scratches/scratchesSlice';
import Post from '../scratches/Post';

const ScratchReplies = ({ parentScratchId }: { parentScratchId: number }) => {
  const parentScratch = useAppSelector((state) =>
    selectScratchById(state, parentScratchId)
  );
  const replyIds = useAppSelector(selectScratchReplyIds);

  return (
    <div>
      {replyIds.map((scratchId) => {
        return (
          <Post
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
