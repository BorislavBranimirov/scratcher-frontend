import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { getUserByUsername } from '../../axiosApi';
import { apiError, User } from '../../common/types';

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const openUserPreview = createAsyncThunk<
  { user: User; pos: ElementPosition },
  { username: string; pos: ElementPosition },
  { rejectValue: string }
>('userPreview/openUserPreview', async (args, thunkApi) => {
  try {
    const user = (await getUserByUsername(args.username)).data;
    return { user, pos: args.pos };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface UserPreviewState {
  show: boolean;
  pos: ElementPosition;
  mouseLeft: boolean;
  userId: number | null;
}

const initialState: UserPreviewState = {
  show: false,
  pos: { x: 0, y: 0, width: 0, height: 0 },
  mouseLeft: false,
  userId: null,
};

export const userPreviewSlice = createSlice({
  name: 'userPreview',
  initialState,
  reducers: {
    setUserPreviewMouseLeft: (state, action: PayloadAction<boolean>) => {
      state.mouseLeft = action.payload;
    },
    closeUserPreview: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(openUserPreview.fulfilled, (state, action) => {
      state.show = true;
      state.pos = action.payload.pos;
      state.mouseLeft = false;
      state.userId = action.payload.user.id;
    });
  },
});

export const { setUserPreviewMouseLeft, closeUserPreview } =
  userPreviewSlice.actions;

export const selectUserPreviewShow = (state: RootState) =>
  state.userPreview.show;

export const selectUserPreviewPos = (state: RootState) => state.userPreview.pos;

export const selectUserPreviewMouseLeft = (state: RootState) =>
  state.userPreview.mouseLeft;

export const selectUserPreviewUserId = (state: RootState) =>
  state.userPreview.userId;

export const selectUserPreviewUser = (state: RootState) =>
  state.userPreview.userId
    ? state.users.entities[state.userPreview.userId]
    : null;

export default userPreviewSlice.reducer;
