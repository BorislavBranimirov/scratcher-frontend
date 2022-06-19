import { useAppSelector } from '../../app/hooks';
import PostWrapper from '../../common/PostWrapper';
import { selectSearchScratchIds } from './searchSlice';
import useScratchSearchScroll from './useScratchSearchScroll';

const SearchPagePosts = () => {
  const ids = useAppSelector(selectSearchScratchIds);

  useScratchSearchScroll();

  return (
    <div>
      {ids.map((id) => {
        return <PostWrapper key={id} scratchId={id} />;
      })}
    </div>
  );
};

export default SearchPagePosts;
