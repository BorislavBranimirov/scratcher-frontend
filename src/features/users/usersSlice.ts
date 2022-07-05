import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { deleteUserFollow, setUserFollow } from '../../axiosApi';
import { apiError, User } from '../../common/types';
import { login, loginFromToken } from '../auth/authSlice';
import { pinScratch, unpinScratch } from '../scratches/scratchesSlice';
import { loadMoreOfUserSearch, loadUserSearch } from '../search/searchSlice';
import { loadSuggestedUsers } from '../suggestedUsers/suggestedUsersSlice';
import {
  loadMoreOfUserFollowers,
  loadUserFollowers,
  loadUserFollowing,
  loadUserLikes,
  loadUserMediaScratches,
  loadUserTimeline,
} from '../timeline/timelineSlice';
import { openUserPreview } from '../userPreview/userPreviewSlice';

export const followUser = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('users/followUser', async (args, thunkApi) => {
  try {
    await setUserFollow(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const unfollowUser = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('users/unfollowUser', async (args, thunkApi) => {
  try {
    await deleteUserFollow(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface UsersState {
  entities: { [key: string]: User };
}

const initialState: UsersState = {
  entities: {},
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(followUser.fulfilled, (state, action) => {
      if (action.payload in state.entities) {
        state.entities[action.payload].isFollowing = true;
      }
    });

    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      if (action.payload in state.entities) {
        state.entities[action.payload].isFollowing = false;
      }
    });

    builder.addCase(pinScratch.fulfilled, (state, action) => {
      const { userId, scratchId } = action.payload;

      state.entities[userId].pinnedId = scratchId;
    });

    builder.addCase(unpinScratch.fulfilled, (state, action) => {
      const userId = action.payload.userId;

      state.entities[userId].pinnedId = null;
    });

    builder.addMatcher(
      isAnyOf(
        loadUserTimeline.fulfilled,
        loadUserMediaScratches.fulfilled,
        loadUserLikes.fulfilled,
        login.fulfilled,
        loginFromToken.fulfilled,
        openUserPreview.fulfilled
      ),
      (state, action) => {
        const user = action.payload.user;

        state.entities = {
          ...state.entities,
          [user.id]: user,
        };
      }
    );

    builder.addMatcher(
      isAnyOf(
        loadUserFollowers.fulfilled,
        loadUserFollowing.fulfilled,
        loadMoreOfUserFollowers.fulfilled,
        loadSuggestedUsers.fulfilled,
        loadUserSearch.fulfilled,
        loadMoreOfUserSearch.fulfilled
      ),
      (state, action) => {
        state.entities = {
          ...state.entities,
          ...action.payload.entities.users,
        };
      }
    );
  },
});

export const selectUserById = (state: RootState, id: number) =>
  state.users.entities[id];

export default usersSlice.reducer;
