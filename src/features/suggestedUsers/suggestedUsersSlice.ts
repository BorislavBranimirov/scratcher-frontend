import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import { getSuggestedUsers } from '../../axiosApi';
import { userEntity } from '../../common/entities';
import { apiError, User } from '../../common/types';

interface LoadSuggestedUsersReturnObj {
  entities: { users: { [key: string]: User } };
  result: number[];
}

export const loadSuggestedUsers = createAsyncThunk<
  LoadSuggestedUsersReturnObj,
  { limit?: number },
  { rejectValue: string }
>('suggestedUsers/loadSuggestedUsers', async (args, thunkApi) => {
  try {
    const res = await getSuggestedUsers(args.limit);

    const normalized = normalize<
      User,
      LoadSuggestedUsersReturnObj['entities'],
      LoadSuggestedUsersReturnObj['result']
    >(res.data, [userEntity]);

    return normalized;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface SuggestedUsersState {
  ids: number[];
  isLoading: boolean;
}

const initialState: SuggestedUsersState = {
  ids: [],
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
      state.ids = action.payload.result;

      state.isLoading = false;
    });
    builder.addCase(loadSuggestedUsers.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const selectSuggestedUserIds = (state: RootState) =>
  state.suggestedUsers.ids;

export const selectSuggestedUsersIsLoading = (state: RootState) =>
  state.suggestedUsers.isLoading;

export default suggestedUsersSlice.reducer;
