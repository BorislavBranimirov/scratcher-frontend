import { useEffect } from 'react';
import { Loader } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
import SuggestedUsersWindow from '../suggestedUsers/SuggestedUsersWindow';
import BookmarksPost from './BookmarksPost';
import {
  loadBookmarks,
  selectBookmarkIds,
  selectBookmarksIsLoading,
} from './bookmarksSlice';

const BookmarksPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const ids = useAppSelector(selectBookmarkIds);
  const isLoading = useAppSelector(selectBookmarksIsLoading);

  useEffect(() => {
    if (user?.id) {
      dispatch(loadBookmarks({ id: user.id }));
    }
  }, [user?.id, dispatch]);

  return (
    <>
      <div className="col-span-5 border-l border-r border-primary">
        <div className="sticky top-0 bg-neutral border-b border-primary px-4 pt-1 pb-2 z-10">
          <h2 className="text-lg font-bold leading-6">Bookmarks</h2>
          <p className="text-xs text-secondary">@{user?.username}</p>
        </div>
        {isLoading ? (
          <Loader size={32} className="animate-spin-slow w-full mt-10" />
        ) : (
          ids.map((id) => {
            return <BookmarksPost key={id} scratchId={id} />;
          })
        )}
      </div>
      <div className="ml-6 col-span-3">
        <SuggestedUsersWindow />
      </div>
    </>
  );
};

export default BookmarksPage;
