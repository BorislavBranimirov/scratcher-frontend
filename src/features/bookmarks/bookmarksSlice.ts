import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import {
  deleteDirectRescratch,
  deleteScratch,
  deleteScratchBookmark,
  deleteScratchLike,
  deleteScratchPin,
  getBookmarks,
  postScratch,
  setScratchLike,
  setScratchPin,
} from '../../axiosApi';
import { scratchEntity } from '../../common/entities';
import { Scratch } from '../../common/types';
import { addQuoteRescratch, replyToScratch } from '../modal/modalSlice';

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
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const removeScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('bookmarks/removeScratch', async (args, thunkApi) => {
  try {
    await deleteScratch(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const addRescratch = createAsyncThunk<
  { rescratchedId: number },
  { rescratchedId: number },
  { rejectValue: string }
>('bookmarks/addRescratch', async (args, thunkApi) => {
  try {
    await postScratch(args);
    return args;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const undoAddRescratch = createAsyncThunk<
  { rescratchedId: number },
  { id: number },
  { rejectValue: string }
>('bookmarks/undoAddRescratch', async (args, thunkApi) => {
  try {
    await deleteDirectRescratch(args.id);
    return { rescratchedId: args.id };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const likeScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('bookmarks/likeScratch', async (args, thunkApi) => {
  try {
    await setScratchLike(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const unlikeScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('bookmarks/unlikeScratch', async (args, thunkApi) => {
  try {
    await deleteScratchLike(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const unbookmarkScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('bookmarks/unbookmarkScratch', async (args, thunkApi) => {
  try {
    await deleteScratchBookmark(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const pinScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('bookmarks/pinScratch', async (args, thunkApi) => {
  try {
    await setScratchPin(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const unpinScratch = createAsyncThunk<
  { userId: number; scratchId: number },
  { id: number },
  { rejectValue: string }
>('bookmarks/unpinScratch', async (args, thunkApi) => {
  try {
    const res = await deleteScratchPin(args.id);
    return { userId: res.data.id, scratchId: res.data.pinnedId };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export interface BookmarksState {
  ids: number[];
  scratches: { [key: string]: Scratch };
  isLoading: boolean;
}

const initialState: BookmarksState = {
  ids: [],
  scratches: {},
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
      state.scratches = action.payload.entities.scratches;

      state.isLoading = false;
    });
    builder.addCase(loadBookmarks.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(removeScratch.fulfilled, (state, action) => {
      if (action.payload in state.scratches) {
        state.ids = state.ids.filter((id) => id !== action.payload);
        delete state.scratches[action.payload];
      }
    });

    builder.addCase(addRescratch.fulfilled, (state, action) => {
      const { rescratchedId } = action.payload;

      if (rescratchedId in state.scratches) {
        state.scratches[rescratchedId].isRescratched = true;
        state.scratches[rescratchedId].rescratchCount += 1;
      }
    });

    builder.addCase(undoAddRescratch.fulfilled, (state, action) => {
      const { rescratchedId } = action.payload;

      if (rescratchedId in state.scratches) {
        state.scratches[rescratchedId].isRescratched = false;
        state.scratches[rescratchedId].rescratchCount -= 1;
      }
    });

    builder.addCase(likeScratch.fulfilled, (state, action) => {
      if (action.payload in state.scratches) {
        state.scratches[action.payload].isLiked = true;
        state.scratches[action.payload].likeCount += 1;
      }
    });

    builder.addCase(unlikeScratch.fulfilled, (state, action) => {
      if (action.payload in state.scratches) {
        state.scratches[action.payload].isLiked = false;
        state.scratches[action.payload].likeCount -= 1;
      }
    });

    builder.addCase(unbookmarkScratch.fulfilled, (state, action) => {
      if (action.payload in state.scratches) {
        state.ids = state.ids.filter((id) => id !== action.payload);
        delete state.scratches[action.payload];
      }
    });

    builder.addCase(replyToScratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (scratch.parentId && scratch.parentId in state.scratches) {
        state.scratches[scratch.parentId].replyCount += 1;
      }
    });

    builder.addCase(addQuoteRescratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (scratch.rescratchedId && scratch.rescratchedId in state.scratches) {
        if (scratch.rescratchType === 'direct') {
          state.scratches[scratch.rescratchedId].isRescratched = true;
        }

        state.scratches[scratch.rescratchedId].rescratchCount += 1;
      }
    });
  },
});

export const selectBookmarks = (state: RootState) => state.bookmarks;

export const selectBookmarkIds = (state: RootState) => state.bookmarks.ids;

export const selectBookmarksIsLoading = (state: RootState) =>
  state.bookmarks.isLoading;

export const selectBookmarkById = (state: RootState, id: number) =>
  state.bookmarks.scratches[id];

export default bookmarksSlice.reducer;
