import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import { getBookmarks } from '../../axiosApi';
import { scratchEntity } from '../../common/entities';
import { apiError, Scratch } from '../../common/types';
import { removeScratch, unbookmarkScratch } from '../scratches/scratchesSlice';

interface LoadScratchBookmarksReturnObj {
  entities: { scratches: { [key: string]: Scratch } };
  result: number[];
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
    >(res.data.bookmarks, [scratchEntity]);

    normalized.entities.scratches = {
      ...normalized.entities.scratches,
      ...res.data.extraScratches,
    };

    return normalized;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface BookmarksState {
  ids: number[];
  isLoading: boolean;
}

const initialState: BookmarksState = {
  ids: [],
  isLoading: false,
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
      state.ids = action.payload.result;

      state.isLoading = false;
    });
    builder.addCase(loadBookmarks.rejected, (state) => {
      state.isLoading = false;
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

export const selectBookmarksIsLoading = (state: RootState) =>
  state.bookmarks.isLoading;

export default bookmarksSlice.reducer;
