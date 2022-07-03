import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import notificationReducer from '../features/notification/notificationSlice';
import timelineReducer from '../features/timeline/timelineSlice';
import bookmarkReducer from '../features/bookmarks/bookmarksSlice';
import scratchPageReducer from '../features/scratchPage/scratchPageSlice';
import suggestedUsersReducer from '../features/suggestedUsers/suggestedUsersSlice';
import modalReducer from '../features/modal/modalSlice';
import scratchesReducer from '../features/scratches/scratchesSlice';
import usersReducer from '../features/users/usersSlice';
import searchReducer from '../features/search/searchSlice';
import userPreviewReducer from '../features/userPreview/userPreviewSlice';
import imagePreviewReducer from '../features/imagePreview/imagePreviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    notification: notificationReducer,
    modal: modalReducer,
    imagePreview: imagePreviewReducer,
    userPreview: userPreviewReducer,
    users: usersReducer,
    scratches: scratchesReducer,
    timeline: timelineReducer,
    bookmarks: bookmarkReducer,
    scratchPage: scratchPageReducer,
    suggestedUsers: suggestedUsersReducer,
    search: searchReducer,
  },
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
