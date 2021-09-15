import {
  createSlice,
  isAnyOf,
  isRejectedWithValue,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  removeScratch as bookmarksRemoveScratch,
  pinScratch as bookmarksPinScratch,
  unpinScratch as bookmarksUnpinScratch,
  unbookmarkScratch as bookmarksUnbookmarkScratch,
} from '../bookmarks/bookmarksSlice';
import {
  addScratch as scratchAddScratch,
  removeScratch as scratchRemoveScratch,
  bookmarkScratch as scratchBookmarkScratch,
  unbookmarkScratch as scratchUnbookmarkScratch,
  pinScratch as scratchPinScratch,
  unpinScratch as scratchUnpinScratch,
} from '../scratchPage/scratchPageSlice';
import {
  addScratch as timelineAddScratch,
  removeScratch as timelineRemoveScratch,
  bookmarkScratch as timelineBookmarkScratch,
  unbookmarkScratch as timelineUnbookmarkScratch,
  pinScratch as timelinePinScratch,
  unpinScratch as timelineUnpinScratch,
} from '../timeline/timelineSlice';

export interface NotificationState {
  messages: string[];
}

const initialState: NotificationState = {
  messages: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
    popNotification: (state) => {
      state.messages.shift();
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(timelineAddScratch.fulfilled, scratchAddScratch.fulfilled),
      (state) => {
        state.messages.push('Your scratch was sent.');
      }
    );

    builder.addMatcher(
      isAnyOf(
        timelineRemoveScratch.fulfilled,
        scratchRemoveScratch.fulfilled,
        bookmarksRemoveScratch.fulfilled
      ),
      (state) => {
        state.messages.push('Your scratch was deleted.');
      }
    );

    builder.addMatcher(
      isAnyOf(
        timelineBookmarkScratch.fulfilled,
        scratchBookmarkScratch.fulfilled
      ),
      (state) => {
        state.messages.push('Scratch was added to your bookmarks.');
      }
    );

    builder.addMatcher(
      isAnyOf(
        timelineUnbookmarkScratch.fulfilled,
        scratchUnbookmarkScratch.fulfilled,
        bookmarksUnbookmarkScratch.fulfilled
      ),
      (state) => {
        state.messages.push('Scratch was removed from your bookmarks.');
      }
    );

    builder.addMatcher(
      isAnyOf(
        timelinePinScratch.fulfilled,
        scratchPinScratch.fulfilled,
        bookmarksPinScratch.fulfilled
      ),
      (state) => {
        state.messages.push('Your scratch was pinned to your profile.');
      }
    );

    builder.addMatcher(
      isAnyOf(
        timelineUnpinScratch.fulfilled,
        scratchUnpinScratch.fulfilled,
        bookmarksUnpinScratch.fulfilled
      ),
      (state) => {
        state.messages.push('Your scratch was unpinned from your profile.');
      }
    );

    builder.addDefaultCase((state, action) => {
      if (isRejectedWithValue(action)) {
        if (typeof action.payload === 'string')
          state.messages.push(action.payload);
      }
    });
  },
});

export const { pushNotification, popNotification } = notificationSlice.actions;

export const selectNotification = (state: RootState) =>
  state.notification.messages[0];

export default notificationSlice.reducer;
