import { useAppSelector } from '../../app/hooks';
import Post from '../scratches/Post';
import { selectScratchById } from '../scratches/scratchesSlice';

const PostWrapper = ({ scratchId }: { scratchId: number }) => {
  const scratch = useAppSelector((state) =>
    selectScratchById(state, scratchId)
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
