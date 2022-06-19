import { useAppSelector } from '../../app/hooks';
import UserItem from '../users/UserItem';
import { selectSearchUserIds } from './searchSlice';
import useUserSearchScroll from './useUserSearchScroll';

const SearchPageUsersList = () => {
  const ids = useAppSelector(selectSearchUserIds);

  useUserSearchScroll();

  return (
    <div>
      {ids.map((id) => {
        return <UserItem key={id} userId={id} extended />;
      })}
    </div>
  );
};

export default SearchPageUsersList;
