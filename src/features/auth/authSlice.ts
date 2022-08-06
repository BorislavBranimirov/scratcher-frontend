import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { RootState } from '../../app/store';
import { getUserByUsername } from '../../axiosApi';
import { apiError, decodedJWT, User } from '../../common/types';

interface loginReturnObj {
  user: User;
  token: string;
}

export const login = createAsyncThunk<
  loginReturnObj,
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async (args, thunkApi) => {
  try {
    const accessToken = (
      await axios.post<{ accessToken: string }>('/api/auth/login', args, {
        withCredentials: true,
      })
    ).data.accessToken;

    const res = await getUserByUsername(args.username);

    return { user: res.data, token: accessToken };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const loginFromToken = createAsyncThunk<
  { user: User },
  undefined,
  { rejectValue: string; state: RootState }
>('auth/loginFromToken', async (_, thunkApi) => {
  try {
    const accessToken = thunkApi.getState().auth.token;
    if (!accessToken) {
      return thunkApi.rejectWithValue('No access token found');
    }

    const userData = jwt_decode<decodedJWT>(accessToken);

    const res = await getUserByUsername(userData.username);

    return { user: res.data };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const res = await axios.post<{ success: boolean }>(
    '/api/auth/logout',
    {},
    { withCredentials: true }
  );
  return res.data;
});

export interface AuthState {
  token: string | null;
  userId: number | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('accessToken'),
  userId: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearAccessToken: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.userId = action.payload.user.id;
      state.token = action.payload.token;
    });

    builder.addCase(loginFromToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginFromToken.fulfilled, (state, action) => {
      state.userId = action.payload.user.id;
      state.isLoading = false;
    });
    builder.addCase(loginFromToken.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.userId = null;
      state.token = null;
    });
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export const selectAuthUserId = (state: RootState) => state.auth.userId;

export const selectAuthUser = (state: RootState) =>
  state.auth.userId ? state.users.entities[state.auth.userId] : null;

export const selectAuthUserPinnedId = (state: RootState) =>
  state.auth.userId ? state.users.entities[state.auth.userId].pinnedId : null;

export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;

export const selectAuthIsLogged = (state: RootState) =>
  state.auth.userId !== null;

export const selectAuthHasToken = (state: RootState) =>
  state.auth.token !== null;

export default authSlice.reducer;
