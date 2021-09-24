import { useAppSelector } from '../../app/hooks';
import SuggestedUserItem from './SuggestedUserItem';
import { selectSuggestedUsers } from './suggestedUsersSlice';

const SuggestedUsersList = ({ extended }: { extended?: boolean }) => {
  const users = useAppSelector(selectSuggestedUsers);

  return (
    <div className="pt-2">
      {users.map((user) => {
        return (
          <SuggestedUserItem key={user.id} user={user} extended={extended} />
        );
      })}
    </div>
  );
};

export default SuggestedUsersList;
