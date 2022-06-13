import { useAppSelector } from '../../app/hooks';
import FollowersItem from './FollowersItem';
import { selectUserFollowers } from './timelineSlice';

const FollowersList = () => {
  const users = useAppSelector(selectUserFollowers);

  return (
    <div>
      {users.map((user) => {
        return <FollowersItem key={user.id} user={user} />;
      })}
    </div>
  );
};

export default FollowersList;
