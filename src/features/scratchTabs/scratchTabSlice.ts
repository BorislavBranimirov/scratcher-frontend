import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import {
  getScratch,
  getScratchLikedUsers,
  getScratchRescratchedUsers,
} from '../../axiosApi';
import { userEntity } from '../../common/entities';
import { apiError, Scratch, User } from '../../common/types';

interface LoadScratchRescratchedUsersReturnObj {
  scratchId: number;
  entities: {
    users: { [key: string]: User };
    scratches: { [key: string]: Scratch };
  };
  result: number[];
  isFinished: boolean;
}

export const loadScratchRescratchedUsers = createAsyncThunk<
  LoadScratchRescratchedUsersReturnObj,
  { id: number },
  { rejectValue: string }
>('scratchTab/loadRescratchedUsers', async (args, thunkApi) => {
  try {
    const scratchObj = (await getScratch(args.id)).data;

    const res = await getScratchRescratchedUsers(args.id);

    const normalized = normalize<
      User,
      LoadScratchRescratchedUsersReturnObj['entities'],
      LoadScratchRescratchedUsersReturnObj['result']
    >(res.data.users, [userEntity]);

    normalized.entities.scratches = {
      [args.id]: scratchObj.scratch,
      ...scratchObj.extraScratches,
    };

    return {
      scratchId: args.id,
      ...normalized,
      isFinished: res.data.isFinished,
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

interface LoadScratchLikedUsersReturnObj {
  scratchId: number;
  entities: {
    users: { [key: string]: User };
    scratches: { [key: string]: Scratch };
  };
  result: number[];
  isFinished: boolean;
}

export const loadScratchLikedUsers = createAsyncThunk<
  LoadScratchLikedUsersReturnObj,
  { id: number },
  { rejectValue: string }
>('scratchTab/loadLikedUsers', async (args, thunkApi) => {
  try {
    const scratchObj = (await getScratch(args.id)).data;

    const res = await getScratchLikedUsers(args.id);

    const normalized = normalize<
      User,
      LoadScratchLikedUsersReturnObj['entities'],
      LoadScratchLikedUsersReturnObj['result']
    >(res.data.users, [userEntity]);

    normalized.entities.scratches = {
      [args.id]: scratchObj.scratch,
      ...scratchObj.extraScratches,
    };

    return {
      scratchId: args.id,
      ...normalized,
      isFinished: res.data.isFinished,
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

interface LoadMoreOfScratchTabReturnObj {
  entities: { users: { [key: string]: User } };
  result: number[];
  isFinished: boolean;
}

export const loadMoreOfScratchTab = createAsyncThunk<
  LoadMoreOfScratchTabReturnObj,
  { limit?: number; after: number },
  { rejectValue: string; state: RootState }
>('scratchTab/loadMoreOfScratchTab', async (args, thunkApi) => {
  try {
    const type = thunkApi.getState().scratchTab.type;
    const scratchId = thunkApi.getState().scratchTab.scratchId;

    let res;
    if (scratchId) {
      if (type === 'rescratches') {
        res = await getScratchRescratchedUsers(
          scratchId,
          args.limit,
          args.after
        );
      } else if (type === 'likes') {
        res = await getScratchLikedUsers(scratchId, args.limit, args.after);
      }
    }

    if (!res) {
      throw new Error('Scratch not provided.');
    }

    const normalized = normalize<
      User,
      LoadMoreOfScratchTabReturnObj['entities'],
      LoadMoreOfScratchTabReturnObj['result']
    >(res.data.users, [userEntity]);

    return { ...normalized, isFinished: res.data.isFinished };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface ScratchTabsState {
  type: 'rescratches' | 'likes' | null;
  scratchId: number | null;
  userIds: number[];
  isFinished: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
}

const initialState: ScratchTabsState = {
  type: null,
  scratchId: null,
  userIds: [],
  isFinished: false,
  isLoading: false,
  isLoadingMore: false,
};

export const scratchTabSlice = createSlice({
  name: 'scratchTab',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadScratchRescratchedUsers.fulfilled, (state, action) => {
      state.scratchId = action.payload.scratchId;
      state.userIds = action.payload.result;
      state.isFinished = action.payload.isFinished;

      state.type = 'rescratches';
      state.isLoading = false;
    });

    builder.addCase(loadScratchLikedUsers.fulfilled, (state, action) => {
      state.scratchId = action.payload.scratchId;
      state.userIds = action.payload.result;
      state.isFinished = action.payload.isFinished;

      state.type = 'likes';
      state.isLoading = false;
    });

    builder.addCase(loadMoreOfScratchTab.pending, (state) => {
      state.isLoadingMore = true;
    });
    builder.addCase(loadMoreOfScratchTab.fulfilled, (state, action) => {
      state.userIds.push(...action.payload.result);
      state.isFinished = action.payload.isFinished;
      state.isLoadingMore = false;
    });
    builder.addCase(loadMoreOfScratchTab.rejected, (state) => {
      state.isLoadingMore = false;
    });

    builder.addMatcher(
      isAnyOf(
        loadScratchRescratchedUsers.pending,
        loadScratchLikedUsers.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        loadScratchRescratchedUsers.rejected,
        loadScratchLikedUsers.rejected
      ),
      () => {
        return initialState;
      }
    );
  },
});

export const selectScratchTabScratchId = (state: RootState) =>
  state.scratchTab.scratchId;

export const selectScratchTabUserIds = (state: RootState) =>
  state.scratchTab.userIds;

export const selectScratchTabLastUserId = (state: RootState) =>
  state.scratchTab.userIds[state.scratchTab.userIds.length - 1];

export const selectScratchTabIsLoading = (state: RootState) =>
  state.scratchTab.isLoading;

export const selectScratchTabIsLoadingMore = (state: RootState) =>
  state.scratchTab.isLoadingMore;

export const selectScratchTabIsFinished = (state: RootState) =>
  state.scratchTab.isFinished;

export default scratchTabSlice.reducer;
