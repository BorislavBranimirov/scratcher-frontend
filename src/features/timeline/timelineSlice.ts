import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import {
  getHomeTimeline,
  getScratch,
  getUserByUsername,
  getUserTimeline,
  setScratchLike,
  deleteScratchLike,
  setScratchPin,
  deleteScratchPin,
  setScratchBookmark,
  deleteScratchBookmark,
  getUserLikes,
  deleteScratch,
  postScratch,
  setUserFollow,
  deleteUserFollow,
  deleteDirectRescratch,
  getUserFollowers,
  getUserFollowed,
} from '../../axiosApi';
import { scratchEntity } from '../../common/entities';
import {
  apiError,
  PostScratchRequestObj,
  Scratch,
  ScratchResponseObj,
  User,
} from '../../common/types';
import {
  addModalScratch,
  addQuoteRescratch,
  replyToScratch,
} from '../modal/modalSlice';

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
  user: User | null;
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
    const userId = thunkApi.getState().timeline.user?.id;

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

export const addScratch = createAsyncThunk<
  ScratchResponseObj,
  PostScratchRequestObj,
  { rejectValue: string }
>('timeline/addScratch', async (args, thunkApi) => {
  try {
    const scratchId = (await postScratch(args)).data.id;

    const res = await getScratch(scratchId);

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const removeScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('timeline/removeScratch', async (args, thunkApi) => {
  try {
    await deleteScratch(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const addRescratch = createAsyncThunk<
  ScratchResponseObj,
  { rescratchedId: number },
  { rejectValue: string }
>('timeline/addRescratch', async (args, thunkApi) => {
  try {
    const scratchId = (await postScratch(args)).data.id;

    const res = await getScratch(scratchId);

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const undoAddRescratch = createAsyncThunk<
  { id: number; rescratchedId: number },
  { id: number },
  { rejectValue: string }
>('timeline/undoAddRescratch', async (args, thunkApi) => {
  try {
    const res = await deleteDirectRescratch(args.id);
    return { id: res.data.id, rescratchedId: args.id };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const likeScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('timeline/likeScratch', async (args, thunkApi) => {
  try {
    await setScratchLike(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const unlikeScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('timeline/unlikeScratch', async (args, thunkApi) => {
  try {
    await deleteScratchLike(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const bookmarkScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('timeline/bookmarkScratch', async (args, thunkApi) => {
  try {
    await setScratchBookmark(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const unbookmarkScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('timeline/unbookmarkScratch', async (args, thunkApi) => {
  try {
    await deleteScratchBookmark(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const pinScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('timeline/pinScratch', async (args, thunkApi) => {
  try {
    await setScratchPin(args.id);
    return args.id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const unpinScratch = createAsyncThunk<
  { userId: number; scratchId: number },
  { id: number },
  { rejectValue: string }
>('timeline/unpinScratch', async (args, thunkApi) => {
  try {
    const res = await deleteScratchPin(args.id);
    return { userId: res.data.id, scratchId: res.data.pinnedId };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

interface LoadUserFollowersReturnObj {
  user: User;
  followers: User[];
}

export const loadUserFollowers = createAsyncThunk<
  LoadUserFollowersReturnObj,
  { username: string },
  { rejectValue: string }
>('timeline/loadUserFollowers', async (args, thunkApi) => {
  try {
    const user = (await getUserByUsername(args.username)).data;

    const res = await getUserFollowers(user.id);

    return { user, followers: res.data };
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

    return { user, followers: res.data };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const followUser = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('timeline/followUser', async (args, thunkApi) => {
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
>('timeline/unfollowUser', async (args, thunkApi) => {
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

export interface TimelineState {
  type:
    | 'home'
    | 'userTimeline'
    | 'userLikes'
    | 'followers'
    | 'following'
    | null;
  user: User | null;
  pinnedScratchId: number | null;
  ids: number[];
  scratches: { [key: string]: Scratch };
  followers: User[];
  isFinished: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
}

const initialState: TimelineState = {
  type: null,
  user: null,
  pinnedScratchId: null,
  ids: [],
  scratches: {},
  followers: [],
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
      if (state.user || state.pinnedScratchId) {
        state.user = null;
        state.pinnedScratchId = null;
      }

      state.ids = action.payload.result;
      state.scratches = action.payload.entities.scratches;
      state.isFinished = action.payload.isFinished;

      state.type = 'home';
      state.isLoading = false;
    });

    builder.addCase(loadUserTimeline.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.pinnedScratchId = action.payload.pinnedScratchId;
      state.ids = action.payload.result;
      state.scratches = action.payload.entities.scratches;
      state.isFinished = action.payload.isFinished;

      state.type = 'userTimeline';
      state.isLoading = false;
    });

    builder.addCase(loadUserLikes.fulfilled, (state, action) => {
      if (state.pinnedScratchId) {
        state.pinnedScratchId = null;
      }
      state.user = action.payload.user;
      state.ids = action.payload.result;
      state.scratches = action.payload.entities.scratches;
      state.isFinished = true;

      state.type = 'userLikes';
      state.isLoading = false;
    });

    builder.addCase(loadMoreOfTimeline.fulfilled, (state, action) => {
      state.ids.push(...action.payload.result);
      state.scratches = {
        ...state.scratches,
        ...action.payload.entities.scratches,
      };
      state.isFinished = action.payload.isFinished;
      state.isLoadingMore = false;
    });

    builder.addCase(loadMoreOfTimeline.pending, (state) => {
      state.isLoadingMore = true;
    });

    builder.addCase(loadMoreOfTimeline.rejected, (state) => {
      state.isLoadingMore = false;
    });

    builder.addCase(addScratch.fulfilled, (state, action) => {
      if (state.type === 'home') {
        const scratch = action.payload.scratch;

        state.ids.unshift(scratch.id);
        state.scratches[scratch.id] = scratch;

        state.scratches = {
          ...state.scratches,
          ...action.payload.extraScratches,
        };
      }
    });

    builder.addCase(removeScratch.fulfilled, (state, action) => {
      if (state.pinnedScratchId === action.payload) {
        state.pinnedScratchId = null;
      }

      if (action.payload in state.scratches) {
        state.ids = state.ids.filter((id) => id !== action.payload);
        delete state.scratches[action.payload];
      }
    });

    builder.addCase(addRescratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (scratch.rescratchedId && scratch.rescratchedId in state.scratches) {
        state.scratches[scratch.rescratchedId].isRescratched = true;
        state.scratches[scratch.rescratchedId].rescratchCount += 1;
      }

      if (
        state.type === 'home' ||
        (state.type === 'userTimeline' && state.user?.id === scratch.authorId)
      ) {
        state.ids.unshift(scratch.id);
        state.scratches[scratch.id] = scratch;

        state.scratches = {
          ...state.scratches,
          ...action.payload.extraScratches,
        };
      }
    });

    builder.addCase(undoAddRescratch.fulfilled, (state, action) => {
      if (state.pinnedScratchId === action.payload.id) {
        state.pinnedScratchId = null;
      }

      if (action.payload.rescratchedId in state.scratches) {
        state.scratches[action.payload.rescratchedId].isRescratched = false;
        state.scratches[action.payload.rescratchedId].rescratchCount -= 1;
      }

      if (action.payload.id) {
        state.ids = state.ids.filter((id) => id !== action.payload.id);
        delete state.scratches[action.payload.id];
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

    builder.addCase(bookmarkScratch.fulfilled, (state, action) => {
      if (action.payload in state.scratches) {
        state.scratches[action.payload].isBookmarked = true;
      }
    });

    builder.addCase(unbookmarkScratch.fulfilled, (state, action) => {
      if (action.payload in state.scratches) {
        state.scratches[action.payload].isBookmarked = false;
      }
    });

    builder.addCase(pinScratch.fulfilled, (state, action) => {
      if (action.payload in state.scratches) {
        const scratch = state.scratches[action.payload];

        if (
          state.user?.id === scratch.authorId &&
          state.type === 'userTimeline'
        ) {
          state.pinnedScratchId = scratch.id;
        }
      }
    });

    builder.addCase(unpinScratch.fulfilled, (state, action) => {
      if (
        state.user?.id === action.payload.userId &&
        state.type === 'userTimeline'
      ) {
        state.pinnedScratchId = null;

        if (
          !state.ids.includes(action.payload.scratchId) &&
          action.payload.scratchId in state.scratches
        ) {
          delete state.scratches[action.payload.scratchId];
        }
      }
    });

    builder.addCase(loadUserFollowers.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.followers = action.payload.followers;

      state.type = 'followers';
      state.isLoading = false;
    });

    builder.addCase(loadUserFollowing.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.followers = action.payload.followers;

      state.type = 'following';
      state.isLoading = false;
    });

    builder.addCase(followUser.fulfilled, (state, action) => {
      if (state.user?.id === action.payload) {
        state.user.isFollowing = true;
      }

      for (const user of state.followers) {
        if (user.id === action.payload) {
          user.isFollowing = true;
        }
      }
    });

    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      if (state.user?.id === action.payload) {
        state.user.isFollowing = false;
      }

      for (const user of state.followers) {
        if (user.id === action.payload) {
          user.isFollowing = false;
        }
      }
    });

    builder.addCase(addModalScratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (
        state.type === 'home' ||
        (state.type === 'userTimeline' && state.user?.id === scratch.authorId)
      ) {
        state.ids.unshift(scratch.id);
        state.scratches[scratch.id] = scratch;

        state.scratches = {
          ...state.scratches,
          ...action.payload.extraScratches,
        };
      }
    });

    builder.addCase(replyToScratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (scratch.parentId && scratch.parentId in state.scratches) {
        state.scratches[scratch.parentId].replyCount += 1;
      }

      if (
        state.type === 'home' ||
        (state.type === 'userTimeline' && state.user?.id === scratch.authorId)
      ) {
        state.ids.unshift(scratch.id);
        state.scratches[scratch.id] = scratch;

        state.scratches = {
          ...state.scratches,
          ...action.payload.extraScratches,
        };
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

      if (
        state.type === 'home' ||
        (state.type === 'userTimeline' && state.user?.id === scratch.authorId)
      ) {
        state.ids.unshift(scratch.id);
        state.scratches[scratch.id] = scratch;

        state.scratches = {
          ...state.scratches,
          ...action.payload.extraScratches,
        };
      }
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
  },
});

export const selectTimeline = (state: RootState) => state.timeline;

export const selectTimelineUser = (state: RootState) => state.timeline.user;

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

export const selectTimelineScratchById = (state: RootState, id: number) =>
  state.timeline.scratches[id];

export const selectUserFollowers = (state: RootState) =>
  state.timeline.followers;

export default timelineSlice.reducer;
