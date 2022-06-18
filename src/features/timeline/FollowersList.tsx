import { useAppSelector } from '../../app/hooks';
import FollowersItem from './FollowersItem';
import { selectUserFollowerIds } from './timelineSlice';

const FollowersList = () => {
  const ids = useAppSelector(selectUserFollowerIds);

  return (
    <div>
      {ids.map((id) => {
        return <FollowersItem key={id} userId={id} />;
      })}
    </div>
  );
};

export default FollowersList;
