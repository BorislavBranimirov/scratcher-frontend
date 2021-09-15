import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Bookmarks</p>
      <p>@{user?.username}</p>
      {ids.map((id) => {
        return <BookmarksPost key={id} scratchId={id} />;
      })}
    </div>
  );
};

export default BookmarksPage;
