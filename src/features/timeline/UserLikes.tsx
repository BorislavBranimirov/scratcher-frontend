import { useAppSelector } from '../../app/hooks';
import { selectTimelineIds } from './timelineSlice';
import Post from './Post';

const UserLikes = () => {
  const ids = useAppSelector(selectTimelineIds);

  return (
    <div>
      <p>Likes</p>
      {ids.map((id) => {
        return <Post key={id} scratchId={id} />;
      })}
    </div>
  );
};

export default UserLikes;
