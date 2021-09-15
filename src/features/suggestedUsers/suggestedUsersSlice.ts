import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import {
  deleteUserFollow,
  getSuggestedUsers,
  setUserFollow,
} from '../../axiosApi';
import { User } from '../../common/types';

export const loadSuggestedUsers = createAsyncThunk<
  User[],
  { limit?: number },
  { rejectValue: string }
>('suggestedUsers/loadSuggestedUsers', async (args, thunkApi) => {
  try {
    const res = await getSuggestedUsers(args.limit);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const followUser = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('suggestedUsers/followUser', async (args, thunkApi) => {
  try {
    await setUserFollow(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const unfollowUser = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('suggestedUsers/unfollowUser', async (args, thunkApi) => {
  try {
    await deleteUserFollow(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export interface SuggestedUsersState {
  users: User[];
  isLoading: boolean;
}

const initialState: SuggestedUsersState = {
  users: [],
  isLoading: false,
};

export const suggestedUsersSlice = createSlice({
  name: 'suggestedUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadSuggestedUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadSuggestedUsers.fulfilled, (state, action) => {
      state.users = action.payload;

      state.isLoading = false;
    });
    builder.addCase(loadSuggestedUsers.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(followUser.fulfilled, (state, action) => {
      for (const user of state.users) {
        if (user.id === action.payload) {
          user.isFollowing = true;
        }
      }
    });

    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      for (const user of state.users) {
        if (user.id === action.payload) {
          user.isFollowing = false;
        }
      }
    });
  },
});

export const selectSuggestedUsers = (state: RootState) =>
  state.suggestedUsers.users;

export const selectSuggestedUsersIsLoading = (state: RootState) =>
  state.suggestedUsers.isLoading;

export default suggestedUsersSlice.reducer;
