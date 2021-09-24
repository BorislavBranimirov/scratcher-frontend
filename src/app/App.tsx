import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  loginFromToken,
  selectAuthHasToken,
  selectAuthIsLoading,
  selectAuthIsLogged,
} from '../features/auth/authSlice';
import PrivateRoute from '../common/PrivateRoute';
import Home from '../features/timeline/Home';
import Login from '../features/auth/Login';
import { useEffect } from 'react';
import SideBarMenu from '../features/sidebar/SideBarMenu';
import UserPage from '../features/timeline/UserPage';
import BookmarksPage from '../features/bookmarks/BookmarksPage';
import ScratchPage from '../features/scratchPage/ScratchPage';
import { scratchPath, userPagePath } from '../common/routePaths';
import Notification from '../features/notification/Notification';
import SuggestedUsersPage from '../features/suggestedUsers/SuggestedUsersPage';
import Modal from '../features/modal/Modal';
import { Loader } from 'react-feather';

const App = () => {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector(selectAuthIsLogged);
  const isLoading = useAppSelector(selectAuthIsLoading);
  const hasToken = useAppSelector(selectAuthHasToken);

  useEffect(() => {
    if (hasToken && !isLogged) {
      dispatch(loginFromToken());
    }
  }, [hasToken, isLogged, dispatch]);

  if ((hasToken && !isLogged) || isLoading) {
    return (
      <div className="bg-neutral text-primary min-h-screen pt-10">
        <Loader size={32} className="animate-spin-slow w-full" />
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-neutral grid grid-cols-12 text-primary min-h-screen">
        <SideBarMenu />
        <Notification />
        <Modal />
        <main className="col-start-4 col-end-12 grid grid-cols-8">
          <Switch>
            <PrivateRoute path="/home">
              <Home />
            </PrivateRoute>
            <PrivateRoute path="/bookmarks">
              <BookmarksPage />
            </PrivateRoute>
            <PrivateRoute path="/suggested-users">
              <SuggestedUsersPage />
            </PrivateRoute>
            <Route path={scratchPath}>
              <ScratchPage />
            </Route>
            <Route path={userPagePath}>
              <UserPage />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Redirect to="/home" />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
