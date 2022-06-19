import { useAppSelector } from '../../app/hooks';
import UserItem from '../users/UserItem';
import { selectSuggestedUserIds } from './suggestedUsersSlice';

const SuggestedUsersList = ({ extended }: { extended?: boolean }) => {
  const ids = useAppSelector(selectSuggestedUserIds);

  return (
    <div>
      {ids.map((id) => {
        return <UserItem key={id} userId={id} extended={extended} />;
      })}
    </div>
  );
};

export default SuggestedUsersList;
