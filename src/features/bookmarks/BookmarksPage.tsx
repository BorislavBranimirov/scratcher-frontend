import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PageLayout from '../../common/PageLayout';
import { selectAuthUser, selectAuthUserId } from '../auth/authSlice';
import Post from '../scratches/Post';
import {
  loadBookmarks,
  selectBookmarkIds,
  selectBookmarksIsLoading,
} from './bookmarksSlice';
import useBookmarksScroll from './useBookmarksScroll';

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

  useBookmarksScroll();

  return (
    <PageLayout isSoftLoading={isLoading}>
      <div className="sticky top-0 bg-primary border-b border-primary px-4 py-1 z-10">
        <h2 className="text-lg font-bold leading-6">Bookmarks</h2>
        <p className="pb-1 text-xs text-muted">@{user?.username}</p>
      </div>
      {ids.map((id) => {
        return <Post key={id} scratchId={id} />;
      })}
    </PageLayout>
  );
};

export default BookmarksPage;
