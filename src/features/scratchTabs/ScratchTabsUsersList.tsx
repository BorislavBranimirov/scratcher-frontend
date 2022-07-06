import { useAppSelector } from '../../app/hooks';
import UserItem from '../users/UserItem';
import { selectScratchTabUserIds } from './scratchTabSlice';
import useScratchTabScroll from './useScratchTabScroll';

const ScratchTabsUsersList = () => {
  const ids = useAppSelector(selectScratchTabUserIds);

  useScratchTabScroll();

  return (
    <div>
      {ids.map((id) => {
        return <UserItem key={id} userId={id} extended />;
      })}
    </div>
  );
};

export default ScratchTabsUsersList;
