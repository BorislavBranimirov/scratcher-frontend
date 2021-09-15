import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
import { logout } from '../auth/authSlice';
import { generateUserPath } from '../../common/routePaths';

const SideBarMenu = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  return (
    <div>
      <p>Scratcher</p>
      {user && <Link to="/home">Home</Link>}
      {!user && <Link to="/login">Login</Link>}
      {user && <Link to="/bookmarks">Bookmarks</Link>}
      {user && (
        <Link to={generateUserPath({ username: user.username })}>Profile</Link>
      )}
      <Link to="/settings">Settings</Link>
      <Link to="/user/testUser1">testUser1</Link>
      <Link to="/user/testUser2">testUser2</Link>
      {user && (
        <p>
          Current user: {user?.id} {user?.username}
        </p>
      )}
      {user && <button onClick={() => dispatch(logout())}>Clear</button>}
      <hr />
    </div>
  );
};

export default SideBarMenu;
