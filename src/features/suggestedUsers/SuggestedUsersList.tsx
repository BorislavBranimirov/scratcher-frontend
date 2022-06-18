import { useAppSelector } from '../../app/hooks';
import SuggestedUserItem from './SuggestedUserItem';
import { selectSuggestedUserIds } from './suggestedUsersSlice';

const SuggestedUsersList = ({ extended }: { extended?: boolean }) => {
  const ids = useAppSelector(selectSuggestedUserIds);

  return (
    <div>
      {ids.map((id) => {
        return <SuggestedUserItem key={id} userId={id} extended={extended} />;
      })}
    </div>
  );
};

export default SuggestedUsersList;
