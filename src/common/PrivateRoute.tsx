import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectAuthIsLogged } from '../features/auth/authSlice';

const PrivateRoute = (props: RouteProps) => {
  const isLogged = useAppSelector(selectAuthIsLogged);

  if (!isLogged) {
    const { component, render, children, ...noComponentProps } = props;
    return (
      <Route {...noComponentProps}>
        <Redirect to={'/login'} />
      </Route>
    );
  }

  return <Route {...props} />;
};

export default PrivateRoute;
