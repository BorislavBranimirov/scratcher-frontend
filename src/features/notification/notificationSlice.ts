import {
  createSlice,
  isAnyOf,
  isRejectedWithValue,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  addQuoteRescratch,
  addReplyScratch,
  addScratch,
  bookmarkScratch,
  pinScratch,
  removeScratch,
  unbookmarkScratch,
  unpinScratch,
} from '../scratches/scratchesSlice';

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
    builder.addCase(removeScratch.fulfilled, (state) => {
      state.messages.push('Your scratch was deleted.');
    });

    builder.addCase(bookmarkScratch.fulfilled, (state) => {
      state.messages.push('Scratch was added to your bookmarks.');
    });

    builder.addCase(unbookmarkScratch.fulfilled, (state) => {
      state.messages.push('Scratch was removed from your bookmarks.');
    });

    builder.addCase(pinScratch.fulfilled, (state) => {
      state.messages.push('Your scratch was pinned to your profile.');
    });

    builder.addCase(unpinScratch.fulfilled, (state) => {
      state.messages.push('Your scratch was unpinned from your profile.');
    });

    builder.addMatcher(
      isAnyOf(
        addScratch.fulfilled,
        addReplyScratch.fulfilled,
        addQuoteRescratch.fulfilled
      ),
      (state) => {
        state.messages.push('Your scratch was sent.');
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
