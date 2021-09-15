import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import notificationReducer from '../features/notification/notificationSlice';
import timelineReducer from '../features/timeline/timelineSlice';
import bookmarkReducer from '../features/bookmarks/bookmarksSlice';
import scratchPageReducer from '../features/scratchPage/scratchPageSlice';
import suggestedUsersReducer from '../features/suggestedUsers/suggestedUsersSlice';
import modalReducer from '../features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    modal: modalReducer,
    timeline: timelineReducer,
    bookmarks: bookmarkReducer,
    scratchPage: scratchPageReducer,
    suggestedUsers: suggestedUsersReducer,
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
