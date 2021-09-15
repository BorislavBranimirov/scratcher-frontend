import { useAppSelector } from '../../app/hooks';
import ScratchPost from './ScratchPost';
import { selectScratchReplyIds } from './scratchPageSlice';

const ScratchReplies = () => {
  const replyIds = useAppSelector(selectScratchReplyIds);

  return (
    <div>
      Scratch Replies
      {replyIds.map((scratchId) => {
        return <ScratchPost key={scratchId} scratchId={scratchId} />;
      })}
    </div>
  );
};

export default ScratchReplies;
