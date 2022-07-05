import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import { getBookmarks } from '../../axiosApi';
import { scratchEntity } from '../../common/entities';
import { apiError, Scratch } from '../../common/types';
import { removeScratch, unbookmarkScratch } from '../scratches/scratchesSlice';

interface LoadScratchBookmarksReturnObj {
  userId: number;
  entities: { scratches: { [key: string]: Scratch } };
  result: number[];
  isFinished: boolean;
}

export const loadBookmarks = createAsyncThunk<
  LoadScratchBookmarksReturnObj,
  { id: number },
  { rejectValue: string }
>('bookmarks/loadBookmarks', async (args, thunkApi) => {
  try {
    const res = await getBookmarks(args.id);

    const normalized = normalize<
      Scratch,
      LoadScratchBookmarksReturnObj['entities'],
      LoadScratchBookmarksReturnObj['result']
    >(res.data.scratches, [scratchEntity]);

    normalized.entities.scratches = {
      ...normalized.entities.scratches,
      ...res.data.extraScratches,
    };

    return { userId: args.id, ...normalized, isFinished: res.data.isFinished };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

interface LoadMoreOfBookmarksReturnObj {
  entities: { scratches: { [key: string]: Scratch } };
  result: number[];
  isFinished: boolean;
}

export const loadMoreOfBookmarks = createAsyncThunk<
  LoadMoreOfBookmarksReturnObj,
  { limit?: number; after: number },
  { rejectValue: string; state: RootState }
>('bookmarks/loadMoreOfBookmarks', async (args, thunkApi) => {
  try {
    const userId = thunkApi.getState().bookmarks.userId;
    if (!userId) {
      throw new Error('User not provided.');
    }

    const res = await getBookmarks(userId, args.limit, args.after);

    const normalized = normalize<
      Scratch,
      LoadMoreOfBookmarksReturnObj['entities'],
      LoadMoreOfBookmarksReturnObj['result']
    >(res.data.scratches, [scratchEntity]);

    normalized.entities.scratches = {
      ...normalized.entities.scratches,
      ...res.data.extraScratches,
    };

    return { ...normalized, isFinished: res.data.isFinished };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface BookmarksState {
  userId: number | null;
  ids: number[];
  isFinished: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
}

const initialState: BookmarksState = {
  userId: null,
  ids: [],
  isFinished: false,
  isLoading: false,
  isLoadingMore: false,
};

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadBookmarks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadBookmarks.fulfilled, (state, action) => {
      state.userId = action.payload.userId;
      state.ids = action.payload.result;
      state.isFinished = action.payload.isFinished;

      state.isLoading = false;
    });
    builder.addCase(loadBookmarks.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(loadMoreOfBookmarks.pending, (state) => {
      state.isLoadingMore = true;
    });
    builder.addCase(loadMoreOfBookmarks.fulfilled, (state, action) => {
      state.ids.push(...action.payload.result);
      state.isFinished = action.payload.isFinished;
      state.isLoadingMore = false;
    });
    builder.addCase(loadMoreOfBookmarks.rejected, (state) => {
      state.isLoadingMore = false;
    });

    builder.addMatcher(
      isAnyOf(removeScratch.fulfilled, unbookmarkScratch.fulfilled),
      (state, action) => {
        if (state.ids.includes(action.payload)) {
          state.ids = state.ids.filter((id) => id !== action.payload);
        }
      }
    );
  },
});

export const selectBookmarkIds = (state: RootState) => state.bookmarks.ids;

export const selectBookmarksLastId = (state: RootState) =>
  state.bookmarks.ids[state.bookmarks.ids.length - 1];

export const selectBookmarksIsLoading = (state: RootState) =>
  state.bookmarks.isLoading;

export const selectBookmarksIsLoadingMore = (state: RootState) =>
  state.bookmarks.isLoadingMore;

export const selectBookmarksIsFinished = (state: RootState) =>
  state.bookmarks.isFinished;

export default bookmarksSlice.reducer;
