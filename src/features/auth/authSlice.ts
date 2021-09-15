import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { RootState } from '../../app/store';
import { getUserByUsername } from '../../axiosApi';
import { decodedJWT, User } from '../../common/types';
import {
  pinScratch as bookmarksPinScratch,
  unpinScratch as bookmarksUnpinScratch,
} from '../bookmarks/bookmarksSlice';
import {
  pinScratch as timelinePinScratch,
  unpinScratch as timelineUnpinScratch,
} from '../timeline/timelineSlice';
import {
  pinScratch as scratchPinScratch,
  unpinScratch as scratchUnpinScratch,
} from '../scratchPage/scratchPageSlice';

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
      await axios.post<{ accessToken: string }>('/api/auth/login', args)
    ).data.accessToken;

    const res = await getUserByUsername(args.username);

    return { user: res.data, token: accessToken };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const loginFromToken = createAsyncThunk<
  User,
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

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const res = await axios.post<{ success: boolean }>('/api/auth/logout');
  return res.data;
});

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('accessToken'),
  user: null,
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
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
    });

    builder.addCase(loginFromToken.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
    });

    builder.addMatcher(
      isAnyOf(login.pending, loginFromToken.pending),
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(login.rejected, loginFromToken.rejected),
      (state) => {
        state.isLoading = false;
      }
    );

    builder.addMatcher(
      isAnyOf(
        timelinePinScratch.fulfilled,
        bookmarksPinScratch.fulfilled,
        scratchPinScratch.fulfilled
      ),
      (state, action) => {
        if (state.user) {
          state.user.pinnedId = action.payload;
        }
      }
    );

    builder.addMatcher(
      isAnyOf(
        timelineUnpinScratch.fulfilled,
        bookmarksUnpinScratch.fulfilled,
        scratchUnpinScratch.fulfilled
      ),
      (state) => {
        if (state.user) {
          state.user.pinnedId = null;
        }
      }
    );
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;

export const selectAuthIsLogged = (state: RootState) =>
  state.auth.user !== null;

export const selectAuthHasToken = (state: RootState) =>
  state.auth.token !== null;

export default authSlice.reducer;
