import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import {
  scratchPath,
  searchPagePath,
  userPagePath,
  userPagePathWithTab,
} from '../common/routePaths';
import Notification from '../features/notification/Notification';
import SuggestedUsersPage from '../features/suggestedUsers/SuggestedUsersPage';
import Modal from '../features/modal/Modal';
import { Loader } from 'react-feather';
import SignUp from '../features/auth/SignUp';
import SearchPage from '../features/search/SearchPage';

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
      <div className="bg-neutral grid grid-cols-1 sm:grid-cols-8 md:grid-cols-11 lg:grid-cols-10 xl:grid-cols-12 text-primary min-h-screen">
        <SideBarMenu />
        <Notification />
        <Modal />
        <main className="col-span-1 sm:col-span-7 md:col-span-9 grid grid-cols-1 sm:grid-cols-7 md:grid-cols-9">
          <Routes>
            <Route
              path="home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="bookmarks"
              element={
                <PrivateRoute>
                  <BookmarksPage />
                </PrivateRoute>
              }
            />
            <Route
              path="suggested-users"
              element={
                <PrivateRoute>
                  <SuggestedUsersPage />
                </PrivateRoute>
              }
            />
            <Route path={scratchPath} element={<ScratchPage />} />
            <Route path={userPagePath} element={<UserPage />} />
            <Route path={userPagePathWithTab} element={<UserPage />} />
            <Route path={searchPagePath} element={<SearchPage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
