import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import {
  getHomeTimeline,
  getScratch,
  getUserByUsername,
  getUserTimeline,
  getUserLikes,
  getUserFollowers,
  getUserFollowed,
} from '../../axiosApi';
import { scratchEntity, userEntity } from '../../common/entities';
import { apiError, Scratch, User } from '../../common/types';
import {
  addQuoteRescratch,
  addReplyScratch,
  addRescratch,
  addScratch,
  pinScratch,
  removeScratch,
  undoAddRescratch,
  unpinScratch,
} from '../scratches/scratchesSlice';

interface LoadHomeTimelineReturnObj {
  entities: { scratches: { [key: string]: Scratch } };
  result: number[];
  isFinished: boolean;
}

export const loadHomeTimeline = createAsyncThunk<
  LoadHomeTimelineReturnObj,
  undefined,
  { rejectValue: string }
>('timeline/loadHomeTimeline', async (_, thunkApi) => {
  try {
    const res = await getHomeTimeline();

    const normalized = normalize<
      Scratch,
      LoadHomeTimelineReturnObj['entities'],
      LoadHomeTimelineReturnObj['result']
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

interface LoadUserTimelineReturnObj {
  user: User;
  pinnedScratchId: number | null;
  entities: { scratches: { [key: string]: Scratch } };
  result: number[];
  isFinished: boolean;
}

export const loadUserTimeline = createAsyncThunk<
  LoadUserTimelineReturnObj,
  { username: string },
  { rejectValue: string }
>('timeline/loadUserTimeline', async (args, thunkApi) => {
  try {
    const user = (await getUserByUsername(args.username)).data;

    const pinnedScratchObj = user.pinnedId
      ? (await getScratch(user.pinnedId)).data
      : null;

    const res = await getUserTimeline(user.id);

    const normalized = normalize<
      Scratch,
      LoadUserTimelineReturnObj['entities'],
      LoadUserTimelineReturnObj['result']
    >(res.data.scratches, [scratchEntity]);

    if (pinnedScratchObj) {
      normalized.entities.scratches = {
        [pinnedScratchObj.scratch.id]: pinnedScratchObj.scratch,
        ...pinnedScratchObj.extraScratches,
        ...normalized.entities.scratches,
        ...res.data.extraScratches,
      };
    } else {
      normalized.entities.scratches = {
        ...normalized.entities.scratches,
        ...res.data.extraScratches,
      };
    }

    return {
      user,
      pinnedScratchId: pinnedScratchObj?.scratch.id || null,
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

interface LoadUserLikesReturnObj {
  user: User;
  entities: { scratches: { [key: string]: Scratch } };
  result: number[];
}

export const loadUserLikes = createAsyncThunk<
  LoadUserLikesReturnObj,
  { username: string },
  { rejectValue: string }
>('timeline/loadUserLikes', async (args, thunkApi) => {
  try {
    const user = (await getUserByUsername(args.username)).data;

    const res = await getUserLikes(user.id);

    const normalized = normalize<
      Scratch,
      LoadUserLikesReturnObj['entities'],
      LoadUserLikesReturnObj['result']
    >(res.data.likes, [scratchEntity]);

    normalized.entities.scratches = {
      ...normalized.entities.scratches,
      ...res.data.extraScratches,
    };

    return { user, ...normalized };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

interface LoadMoreOfTimelineReturnObj {
  entities: { scratches: { [key: string]: Scratch } };
  result: number[];
  isFinished: boolean;
}

export const loadMoreOfTimeline = createAsyncThunk<
  LoadMoreOfTimelineReturnObj,
  { limit?: number; after: number },
  { rejectValue: string; state: RootState }
>('timeline/loadMoreOfTimeline', async (args, thunkApi) => {
  try {
    const userId = thunkApi.getState().timeline.userId;

    let res;
    if (userId) {
      res = await getUserTimeline(userId, args.limit, args.after);
    } else {
      res = await getHomeTimeline(args.limit, args.after);
    }

    const normalized = normalize<
      Scratch,
      LoadUserLikesReturnObj['entities'],
      LoadUserLikesReturnObj['result']
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

interface LoadUserFollowersReturnObj {
  userId: number;
  entities: { users: { [key: string]: User } };
  followerIds: number[];
}

export const loadUserFollowers = createAsyncThunk<
  LoadUserFollowersReturnObj,
  { username: string },
  { rejectValue: string }
>('timeline/loadUserFollowers', async (args, thunkApi) => {
  try {
    const user = (await getUserByUsername(args.username)).data;

    const res = await getUserFollowers(user.id);

    const normalized = normalize<
      User,
      LoadUserFollowersReturnObj['entities'],
      LoadUserFollowersReturnObj['followerIds']
    >(res.data, [userEntity]);

    return {
      userId: user.id,
      entities: { ...normalized.entities, [user.id]: user },
      followerIds: normalized.result,
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const loadUserFollowing = createAsyncThunk<
  LoadUserFollowersReturnObj,
  { username: string },
  { rejectValue: string }
>('timeline/loadUserFollowing', async (args, thunkApi) => {
  try {
    const user = (await getUserByUsername(args.username)).data;

    const res = await getUserFollowed(user.id);

    const normalized = normalize<
      User,
      LoadUserFollowersReturnObj['entities'],
      LoadUserFollowersReturnObj['followerIds']
    >(res.data, [userEntity]);

    return {
      userId: user.id,
      entities: { ...normalized.entities, [user.id]: user },
      followerIds: normalized.result,
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface TimelineState {
  type:
    | 'home'
    | 'userTimeline'
    | 'userLikes'
    | 'followers'
    | 'following'
    | null;
  userId: number | null;
  pinnedScratchId: number | null;
  ids: number[];
  followerIds: number[];
  isFinished: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
}

const initialState: TimelineState = {
  type: null,
  userId: null,
  pinnedScratchId: null,
  ids: [],
  followerIds: [],
  isFinished: false,
  isLoading: false,
  isLoadingMore: false,
};

export const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadHomeTimeline.fulfilled, (state, action) => {
      // clear user timeline fields if previously set
      if (state.userId || state.pinnedScratchId) {
        state.userId = null;
        state.pinnedScratchId = null;
      }

      state.ids = action.payload.result;
      state.isFinished = action.payload.isFinished;

      state.type = 'home';
      state.isLoading = false;
    });

    builder.addCase(loadUserTimeline.fulfilled, (state, action) => {
      state.userId = action.payload.user.id;
      state.pinnedScratchId = action.payload.pinnedScratchId;
      state.ids = action.payload.result;
      state.isFinished = action.payload.isFinished;

      state.type = 'userTimeline';
      state.isLoading = false;
    });

    builder.addCase(loadUserLikes.fulfilled, (state, action) => {
      if (state.pinnedScratchId) {
        state.pinnedScratchId = null;
      }
      state.userId = action.payload.user.id;
      state.ids = action.payload.result;
      state.isFinished = true;

      state.type = 'userLikes';
      state.isLoading = false;
    });

    builder.addCase(loadMoreOfTimeline.pending, (state) => {
      state.isLoadingMore = true;
    });
    builder.addCase(loadMoreOfTimeline.fulfilled, (state, action) => {
      state.ids.push(...action.payload.result);
      state.isFinished = action.payload.isFinished;
      state.isLoadingMore = false;
    });
    builder.addCase(loadMoreOfTimeline.rejected, (state) => {
      state.isLoadingMore = false;
    });

    builder.addCase(removeScratch.fulfilled, (state, action) => {
      if (state.pinnedScratchId === action.payload) {
        state.pinnedScratchId = null;
      }

      if (state.ids.includes(action.payload)) {
        state.ids = state.ids.filter((id) => id !== action.payload);
      }
    });

    builder.addCase(undoAddRescratch.fulfilled, (state, action) => {
      const id = action.payload.id;

      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((id) => id !== action.payload.id);
      }
    });

    builder.addCase(pinScratch.fulfilled, (state, action) => {
      if (
        state.type === 'userTimeline' &&
        state.userId === action.payload.userId
      ) {
        state.pinnedScratchId = action.payload.scratchId;
      }
    });

    builder.addCase(unpinScratch.fulfilled, (state, action) => {
      if (
        state.type === 'userTimeline' &&
        state.userId === action.payload.userId
      ) {
        state.pinnedScratchId = null;
      }
    });

    builder.addCase(loadUserFollowers.fulfilled, (state, action) => {
      state.userId = action.payload.userId;
      state.followerIds = action.payload.followerIds;

      state.type = 'followers';
      state.isLoading = false;
    });

    builder.addCase(loadUserFollowing.fulfilled, (state, action) => {
      state.userId = action.payload.userId;
      state.followerIds = action.payload.followerIds;

      state.type = 'following';
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        loadHomeTimeline.pending,
        loadUserTimeline.pending,
        loadUserLikes.pending,
        loadUserFollowers.pending,
        loadUserFollowing.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        loadHomeTimeline.rejected,
        loadUserTimeline.rejected,
        loadUserLikes.rejected,
        loadUserFollowers.rejected,
        loadUserFollowing.rejected
      ),
      (state) => {
        state.isLoading = false;
      }
    );

    builder.addMatcher(
      isAnyOf(
        addScratch.fulfilled,
        addReplyScratch.fulfilled,
        addRescratch.fulfilled,
        addQuoteRescratch.fulfilled
      ),
      (state, action) => {
        const scratch = action.payload.scratch;
        if (
          state.type === 'home' ||
          (state.type === 'userTimeline' && state.userId === scratch.authorId)
        ) {
          state.ids.unshift(scratch.id);
        }
      }
    );
  },
});

export const selectTimelineUserId = (state: RootState) => state.timeline.userId;

export const selectTimelineUser = (state: RootState) =>
  state.timeline.userId ? state.users.entities[state.timeline.userId] : null;

export const selectTimelinePinnedScratchId = (state: RootState) =>
  state.timeline.pinnedScratchId;

export const selectTimelineIds = (state: RootState) => state.timeline.ids;

export const selectTimelineLastId = (state: RootState) =>
  state.timeline.ids[state.timeline.ids.length - 1];

export const selectTimelineIsLoading = (state: RootState) =>
  state.timeline.isLoading;

export const selectTimelineIsLoadingMore = (state: RootState) =>
  state.timeline.isLoadingMore;

export const selectTimelineIsFinished = (state: RootState) =>
  state.timeline.isFinished;

export const selectUserFollowerIds = (state: RootState) =>
  state.timeline.followerIds;

export default timelineSlice.reducer;
