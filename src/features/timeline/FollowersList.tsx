import { useAppSelector } from '../../app/hooks';
import UserItem from '../users/UserItem';
import { selectUserFollowerIds } from './timelineSlice';
import useFollowersTimelineScroll from './useFollowersTimelineScroll';

const FollowersList = () => {
  const ids = useAppSelector(selectUserFollowerIds);

  useFollowersTimelineScroll();

  return (
    <div>
      {ids.map((id) => {
        return <UserItem key={id} userId={id} extended />;
      })}
    </div>
  );
};

export default FollowersList;
