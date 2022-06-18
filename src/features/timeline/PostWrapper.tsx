import { useAppSelector } from '../../app/hooks';
import { selectScratchById } from '../scratches/scratchesSlice';
import Post from './Post';

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
