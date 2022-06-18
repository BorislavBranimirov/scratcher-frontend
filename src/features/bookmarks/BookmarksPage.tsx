import { useEffect } from 'react';
import { Loader } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthUser, selectAuthUserId } from '../auth/authSlice';
import SuggestedUsersWindow from '../suggestedUsers/SuggestedUsersWindow';
import BookmarksPost from './BookmarksPost';
import {
  loadBookmarks,
  selectBookmarkIds,
  selectBookmarksIsLoading,
} from './bookmarksSlice';

const BookmarksPage = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);
  const user = useAppSelector(selectAuthUser);
  const ids = useAppSelector(selectBookmarkIds);
  const isLoading = useAppSelector(selectBookmarksIsLoading);

  useEffect(() => {
    if (userId) {
      dispatch(loadBookmarks({ id: userId }));
    }
  }, [userId, dispatch]);

  if (isLoading) {
    return (
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        <Loader size={32} className="animate-spin-slow w-full mx-auto mt-10" />
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 border-l border-r border-primary">
        <div className="sticky top-0 bg-neutral border-b border-primary px-4 py-1 z-10">
          <h2 className="text-lg font-bold leading-6">Bookmarks</h2>
          <p className="pb-1 text-xs text-secondary">@{user?.username}</p>
        </div>
        {ids.map((id) => {
          return <BookmarksPost key={id} scratchId={id} />;
        })}
      </div>
      <div className="hidden lg:block lg:ml-6 lg:col-span-3 lg:mr-12 xl:mr-0">
        <SuggestedUsersWindow />
      </div>
    </>
  );
};

export default BookmarksPage;
