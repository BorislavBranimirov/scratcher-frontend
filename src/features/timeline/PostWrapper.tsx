import { useAppSelector } from '../../app/hooks';
import Post from './Post';
import { selectTimelineScratchById } from './timelineSlice';

const PostWrapper = ({ scratchId }: { scratchId: number }) => {
  const scratch = useAppSelector((state) =>
    selectTimelineScratchById(state, scratchId)
  );

  if (scratch.rescratchType === 'direct') {
    return (
      <Post
        scratchId={scratch.rescratchedId}
        rescratchAuthor={scratch.author}
      />
    );
  }

  return <Post scratchId={scratchId} />;
};

export default PostWrapper;
