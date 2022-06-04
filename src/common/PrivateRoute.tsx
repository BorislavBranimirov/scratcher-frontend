import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectAuthIsLogged } from '../features/auth/authSlice';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isLogged = useAppSelector(selectAuthIsLogged);

  if (!isLogged) {
    return <Navigate to={'/login'} replace />;
  }

  return children;
};

export default PrivateRoute;
