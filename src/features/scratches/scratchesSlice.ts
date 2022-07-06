import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import {
  deleteDirectRescratch,
  deleteScratch,
  deleteScratchBookmark,
  deleteScratchLike,
  deleteScratchPin,
  getScratch,
  postScratch,
  setScratchBookmark,
  setScratchLike,
  setScratchPin,
} from '../../axiosApi';
import {
  apiError,
  PostReplyRequestObj,
  PostRescratchRequestObj,
  PostScratchRequestObj,
  Scratch,
  ScratchResponseObj,
} from '../../common/types';
import {
  loadBookmarks,
  loadMoreOfBookmarks,
} from '../bookmarks/bookmarksSlice';
import { openReplyModal, openRescratchModal } from '../modal/modalSlice';
import { loadScratchConversation } from '../scratchPage/scratchPageSlice';
import {
  loadScratchLikedUsers,
  loadScratchRescratchedUsers,
} from '../scratchTabs/scratchTabSlice';
import {
  loadMoreOfScratchSearch,
  loadScratchSearch,
} from '../search/searchSlice';
import {
  loadHomeTimeline,
  loadMoreOfTimeline,
  loadUserLikes,
  loadUserMediaScratches,
  loadUserTimeline,
} from '../timeline/timelineSlice';

export const loadScratch = createAsyncThunk<
  ScratchResponseObj,
  { id: number },
  { rejectValue: string }
>('scratches/loadScratch', async (args, thunkApi) => {
  try {
    const res = await getScratch(args.id);

    return res.data;
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
>('scratches/addScratch', async (args, thunkApi) => {
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
>('scratches/removeScratch', async (args, thunkApi) => {
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

export const addReplyScratch = createAsyncThunk<
  ScratchResponseObj,
  PostReplyRequestObj,
  { rejectValue: string }
>('scratches/addReplyScratch', async (args, thunkApi) => {
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

export const addRescratch = createAsyncThunk<
  ScratchResponseObj,
  { rescratchedId: number },
  { rejectValue: string }
>('scratches/addRescratch', async (args, thunkApi) => {
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
>('scratches/undoAddRescratch', async (args, thunkApi) => {
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

export const addQuoteRescratch = createAsyncThunk<
  ScratchResponseObj,
  PostRescratchRequestObj,
  { rejectValue: string }
>('scratches/addQuoteRescratch', async (args, thunkApi) => {
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

export const likeScratch = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>('scratches/likeScratch', async (args, thunkApi) => {
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
>('scratches/unlikeScratch', async (args, thunkApi) => {
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
>('scratches/bookmarkScratch', async (args, thunkApi) => {
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
>('scratches/unbookmarkScratch', async (args, thunkApi) => {
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
  { userId: number; scratchId: number },
  { id: number },
  { rejectValue: string }
>('scratches/pinScratch', async (args, thunkApi) => {
  try {
    const res = await setScratchPin(args.id);
    return { userId: res.data.userId, scratchId: res.data.scratchId };
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
>('scratches/unpinScratch', async (args, thunkApi) => {
  try {
    const res = await deleteScratchPin(args.id);
    return { userId: res.data.userId, scratchId: res.data.scratchId };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface ScratchesState {
  entities: { [key: string]: Scratch };
}

const initialState: ScratchesState = {
  entities: {},
};

export const scratchesSlice = createSlice({
  name: 'scratches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addReplyScratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (scratch.parentId && scratch.parentId in state.entities) {
        state.entities[scratch.parentId].replyCount += 1;
      }

      state.entities = {
        ...state.entities,
        [scratch.id]: scratch,
        ...action.payload.extraScratches,
      };
    });

    builder.addCase(addRescratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (scratch.rescratchedId && scratch.rescratchedId in state.entities) {
        state.entities[scratch.rescratchedId].isRescratched = true;
        state.entities[scratch.rescratchedId].rescratchCount += 1;
      }

      state.entities = {
        ...state.entities,
        [scratch.id]: scratch,
        ...action.payload.extraScratches,
      };
    });

    builder.addCase(undoAddRescratch.fulfilled, (state, action) => {
      const { id, rescratchedId } = action.payload;

      if (rescratchedId in state.entities) {
        state.entities[rescratchedId].isRescratched = false;
        state.entities[rescratchedId].rescratchCount -= 1;
      }

      if (id in state.entities) {
        delete state.entities[id];
      }
    });

    builder.addCase(addQuoteRescratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (scratch.rescratchedId && scratch.rescratchedId in state.entities) {
        if (scratch.rescratchType === 'direct') {
          state.entities[scratch.rescratchedId].isRescratched = true;
        }

        state.entities[scratch.rescratchedId].rescratchCount += 1;
      }

      state.entities = {
        ...state.entities,
        [scratch.id]: scratch,
        ...action.payload.extraScratches,
      };
    });

    builder.addCase(likeScratch.fulfilled, (state, action) => {
      if (action.payload in state.entities) {
        state.entities[action.payload].isLiked = true;
        state.entities[action.payload].likeCount += 1;
      }
    });

    builder.addCase(unlikeScratch.fulfilled, (state, action) => {
      if (action.payload in state.entities) {
        state.entities[action.payload].isLiked = false;
        state.entities[action.payload].likeCount -= 1;
      }
    });

    builder.addCase(bookmarkScratch.fulfilled, (state, action) => {
      if (action.payload in state.entities) {
        state.entities[action.payload].isBookmarked = true;
      }
    });

    builder.addCase(unbookmarkScratch.fulfilled, (state, action) => {
      if (action.payload in state.entities) {
        state.entities[action.payload].isBookmarked = false;
      }
    });

    builder.addMatcher(
      isAnyOf(
        loadHomeTimeline.fulfilled,
        loadUserTimeline.fulfilled,
        loadUserMediaScratches.fulfilled,
        loadUserLikes.fulfilled,
        loadMoreOfTimeline.fulfilled,
        loadBookmarks.fulfilled,
        loadMoreOfBookmarks.fulfilled,
        loadScratchConversation.fulfilled,
        loadScratchSearch.fulfilled,
        loadMoreOfScratchSearch.fulfilled,
        loadScratchRescratchedUsers.fulfilled,
        loadScratchLikedUsers.fulfilled
      ),
      (state, action) => {
        state.entities = {
          ...state.entities,
          ...action.payload.entities.scratches,
        };
      }
    );

    builder.addMatcher(
      isAnyOf(
        loadScratch.fulfilled,
        addScratch.fulfilled,
        openReplyModal.fulfilled,
        openRescratchModal.fulfilled
      ),
      (state, action) => {
        state.entities = {
          ...state.entities,
          [action.payload.scratch.id]: action.payload.scratch,
          ...action.payload.extraScratches,
        };
      }
    );
  },
});

export const selectScratchById = (state: RootState, id: number) =>
  state.scratches.entities[id];

export default scratchesSlice.reducer;
