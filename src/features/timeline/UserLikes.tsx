import { useAppSelector } from '../../app/hooks';
import Post from '../scratches/Post';
import { selectTimelineIds } from './timelineSlice';

const UserLikes = () => {
  const ids = useAppSelector(selectTimelineIds);

  return (
    <div>
      {ids.map((id) => {
        return <Post key={id} scratchId={id} />;
      })}
    </div>
  );
};

export default UserLikes;
