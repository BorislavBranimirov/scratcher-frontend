import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import { getSearchScratches, getSearchUsers } from '../../axiosApi';
import { scratchEntity, userEntity } from '../../common/entities';
import { apiError, Scratch, User } from '../../common/types';
import { removeScratch, undoAddRescratch } from '../scratches/scratchesSlice';

interface LoadScratchSearchReturnObj {
  entities: { scratches: { [key: string]: Scratch } };
  result: number[];
  searchPattern: string;
  isFinished: boolean;
}

export const loadScratchSearch = createAsyncThunk<
  LoadScratchSearchReturnObj,
  { searchPattern: string },
  { rejectValue: string }
>('search/loadScratchSearch', async (args, thunkApi) => {
  try {
    const res = await getSearchScratches(args.searchPattern);

    const normalized = normalize<
      Scratch,
      LoadScratchSearchReturnObj['entities'],
      LoadScratchSearchReturnObj['result']
    >(res.data.scratches, [scratchEntity]);

    normalized.entities.scratches = {
      ...normalized.entities.scratches,
      ...res.data.extraScratches,
    };

    return {
      ...normalized,
      searchPattern: args.searchPattern,
      isFinished: res.data.isFinished,
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

interface LoadMoreOfScratchSearchReturnObj {
  entities: { scratches: { [key: string]: Scratch } };
  result: number[];
  isFinished: boolean;
}

export const loadMoreOfScratchSearch = createAsyncThunk<
  LoadMoreOfScratchSearchReturnObj,
  { limit?: number; after: number },
  { rejectValue: string; state: RootState }
>('search/loadMoreOfScratchSearch', async (args, thunkApi) => {
  try {
    const searchPattern = thunkApi.getState().search.searchPattern;
    if (!searchPattern) {
      throw new Error('Search pattern not specified.');
    }

    const res = await getSearchScratches(searchPattern, args.limit, args.after);

    const normalized = normalize<
      Scratch,
      LoadMoreOfScratchSearchReturnObj['entities'],
      LoadMoreOfScratchSearchReturnObj['result']
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

interface LoadUserSearchReturnObj {
  entities: { users: { [key: string]: User } };
  result: number[];
  searchPattern: string;
  isFinished: boolean;
}

export const loadUserSearch = createAsyncThunk<
  LoadUserSearchReturnObj,
  { searchPattern: string },
  { rejectValue: string }
>('search/loadUserSearch', async (args, thunkApi) => {
  try {
    const res = await getSearchUsers(args.searchPattern);

    const normalized = normalize<
      User,
      LoadUserSearchReturnObj['entities'],
      LoadUserSearchReturnObj['result']
    >(res.data.users, [userEntity]);

    return {
      ...normalized,
      searchPattern: args.searchPattern,
      isFinished: res.data.isFinished,
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

interface LoadMoreOfUserSearchReturnObj {
  entities: { users: { [key: string]: User } };
  result: number[];
  isFinished: boolean;
}

export const loadMoreOfUserSearch = createAsyncThunk<
  LoadMoreOfUserSearchReturnObj,
  { limit?: number; after: string },
  { rejectValue: string; state: RootState }
>('search/loadMoreOfUserSearch', async (args, thunkApi) => {
  try {
    const searchPattern = thunkApi.getState().search.searchPattern;
    if (!searchPattern) {
      throw new Error('Search pattern not specified.');
    }

    const res = await getSearchUsers(searchPattern, args.limit, args.after);

    const normalized = normalize<
      User,
      LoadMoreOfUserSearchReturnObj['entities'],
      LoadMoreOfUserSearchReturnObj['result']
    >(res.data.users, [userEntity]);

    return { ...normalized, isFinished: res.data.isFinished };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface searchState {
  type: 'scratches' | 'users' | null;
  searchPattern: string | null;
  scratchIds: number[];
  userIds: number[];
  isFinished: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
}

const initialState: searchState = {
  type: null,
  searchPattern: null,
  scratchIds: [],
  userIds: [],
  isFinished: false,
  isLoading: false,
  isLoadingMore: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadScratchSearch.fulfilled, (state, action) => {
      state.searchPattern = action.payload.searchPattern;
      state.scratchIds = action.payload.result;
      state.isFinished = action.payload.isFinished;

      state.type = 'scratches';
      state.isLoading = false;
    });

    builder.addCase(loadMoreOfScratchSearch.fulfilled, (state, action) => {
      state.scratchIds.push(...action.payload.result);
      state.isFinished = action.payload.isFinished;
      state.isLoadingMore = false;
    });

    builder.addCase(loadUserSearch.fulfilled, (state, action) => {
      state.searchPattern = action.payload.searchPattern;
      state.userIds = action.payload.result;
      state.isFinished = action.payload.isFinished;

      state.type = 'users';
      state.isLoading = false;
    });

    builder.addCase(loadMoreOfUserSearch.fulfilled, (state, action) => {
      state.userIds.push(...action.payload.result);
      state.isFinished = action.payload.isFinished;
      state.isLoadingMore = false;
    });

    builder.addCase(removeScratch.fulfilled, (state, action) => {
      if (state.scratchIds.includes(action.payload)) {
        state.scratchIds = state.scratchIds.filter(
          (id) => id !== action.payload
        );
      }
    });

    builder.addCase(undoAddRescratch.fulfilled, (state, action) => {
      const id = action.payload.id;

      if (state.scratchIds.includes(id)) {
        state.scratchIds = state.scratchIds.filter(
          (id) => id !== action.payload.id
        );
      }
    });

    builder.addMatcher(
      isAnyOf(loadScratchSearch.pending, loadUserSearch.pending),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(loadScratchSearch.rejected, loadUserSearch.rejected),
      (state) => {
        state.isLoading = false;
      }
    );

    builder.addMatcher(
      isAnyOf(loadMoreOfScratchSearch.pending, loadMoreOfUserSearch.pending),
      (state) => {
        state.isLoadingMore = true;
      }
    );
    builder.addMatcher(
      isAnyOf(loadMoreOfScratchSearch.rejected, loadMoreOfUserSearch.rejected),
      (state) => {
        state.isLoadingMore = false;
      }
    );
  },
});

export const selectSearchScratchIds = (state: RootState) =>
  state.search.scratchIds;

export const selectSearchLastScratchId = (state: RootState) =>
  state.search.scratchIds[state.search.scratchIds.length - 1];

export const selectSearchUserIds = (state: RootState) => state.search.userIds;

export const selectSearchLastUser = (state: RootState) =>
  state.users.entities[state.search.userIds[state.search.userIds.length - 1]];

export const selectSearchIsLoading = (state: RootState) =>
  state.search.isLoading;

export const selectSearchIsLoadingMore = (state: RootState) =>
  state.search.isLoadingMore;

export const selectSearchIsFinished = (state: RootState) =>
  state.search.isFinished;

export default searchSlice.reducer;
