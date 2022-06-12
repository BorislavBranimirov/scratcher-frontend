import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import {
  deleteDirectRescratch,
  deleteScratch,
  deleteScratchBookmark,
  deleteScratchLike,
  deleteScratchPin,
  getScratch,
  getScratchConversation,
  postScratch,
  setScratchBookmark,
  setScratchLike,
  setScratchPin,
} from '../../axiosApi';
import { scratchEntity } from '../../common/entities';
import {
  apiError,
  PostReplyRequestObj,
  Scratch,
  ScratchResponseObj,
} from '../../common/types';
import { addQuoteRescratch, replyToScratch } from '../modal/modalSlice';

interface LoadScratchConversationReturnObj {
  entities: { scratches: { [key: string]: Scratch } };
  result: {
    parentChain: number[];
    scratch: number;
    replies: number[];
  };
}

export const loadScratchConversation = createAsyncThunk<
  LoadScratchConversationReturnObj,
  { id: number },
  { rejectValue: string }
>('scratch/loadScratchConversation', async (args, thunkApi) => {
  try {
    const res = await getScratchConversation(args.id);

    const normalized = normalize<
      Scratch,
      LoadScratchConversationReturnObj['entities'],
      LoadScratchConversationReturnObj['result']
    >(
      {
        parentChain: res.data.parentChain,
        scratch: res.data.scratch,
        replies: res.data.replies,
      },
      {
        parentChain: [scratchEntity],
        scratch: scratchEntity,
        replies: [scratchEntity],
      }
    );

    normalized.entities.scratches = {
      ...normalized.entities.scratches,
      ...res.data.extraScratches,
    };

    return normalized;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const addScratch = createAsyncThunk<
  ScratchResponseObj,
  PostReplyRequestObj,
  { rejectValue: string }
>('scratch/addScratch', async (args, thunkApi) => {
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
>('scratch/removeScratch', async (args, thunkApi) => {
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
  { rescratchedId: number },
  { rescratchedId: number },
  { rejectValue: string }
>('scratch/addRescratch', async (args, thunkApi) => {
  try {
    await postScratch(args);
    return args;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const undoAddRescratch = createAsyncThunk<
  { rescratchedId: number },
  { id: number },
  { rejectValue: string }
>('scratch/undoAddRescratch', async (args, thunkApi) => {
  try {
    await deleteDirectRescratch(args.id);
    return { rescratchedId: args.id };
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
>('scratch/likeScratch', async (args, thunkApi) => {
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
>('scratch/unlikeScratch', async (args, thunkApi) => {
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
>('scratch/bookmarkScratch', async (args, thunkApi) => {
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
>('scratch/unbookmarkScratch', async (args, thunkApi) => {
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
>('scratch/pinScratch', async (args, thunkApi) => {
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
>('scratch/unpinScratch', async (args, thunkApi) => {
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

export interface ScratchState {
  parentChainIds: number[];
  scratchId: number | null;
  replyIds: number[];
  scratches: { [key: string]: Scratch };
  isLoading: boolean;
}

const initialState: ScratchState = {
  parentChainIds: [],
  scratchId: null,
  replyIds: [],
  scratches: {},
  isLoading: false,
};

export const scratchSlice = createSlice({
  name: 'scratch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadScratchConversation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadScratchConversation.fulfilled, (state, action) => {
      state.parentChainIds = action.payload.result.parentChain;
      state.scratchId = action.payload.result.scratch;
      state.replyIds = action.payload.result.replies;
      state.scratches = action.payload.entities.scratches;

      state.isLoading = false;
    });
    builder.addCase(loadScratchConversation.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(addScratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (scratch.parentId && scratch.parentId in state.scratches) {
        state.scratches[scratch.parentId].replyCount += 1;
      }

      state.replyIds.unshift(scratch.id);
      state.scratches[scratch.id] = scratch;

      state.scratches = {
        ...state.scratches,
        ...action.payload.extraScratches,
      };
    });

    builder.addCase(removeScratch.fulfilled, (state, action) => {
      if (
        state.scratchId === action.payload ||
        state.parentChainIds.includes(action.payload)
      ) {
        return initialState;
      }

      if (state.replyIds.includes(action.payload)) {
        state.replyIds = state.replyIds.filter((id) => id !== action.payload);
        delete state.scratches[action.payload];
      }
    });

    builder.addCase(addRescratch.fulfilled, (state, action) => {
      const { rescratchedId } = action.payload;

      if (rescratchedId in state.scratches) {
        state.scratches[rescratchedId].isRescratched = true;
        state.scratches[rescratchedId].rescratchCount += 1;
      }
    });

    builder.addCase(undoAddRescratch.fulfilled, (state, action) => {
      const { rescratchedId } = action.payload;

      if (rescratchedId in state.scratches) {
        state.scratches[rescratchedId].isRescratched = false;
        state.scratches[rescratchedId].rescratchCount -= 1;
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

    builder.addCase(replyToScratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (scratch.parentId && scratch.parentId in state.scratches) {
        state.scratches[scratch.parentId].replyCount += 1;

        if (state.scratchId === scratch.parentId) {
          state.replyIds.unshift(scratch.id);
          state.scratches[scratch.id] = scratch;

          state.scratches = {
            ...state.scratches,
            ...action.payload.extraScratches,
          };
        }
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
    });
  },
});

export const selectScratch = (state: RootState) => state.scratchPage;

export const selectScratchParentChainIds = (state: RootState) =>
  state.scratchPage.parentChainIds;

export const selectScratchMainScratchId = (state: RootState) =>
  state.scratchPage.scratchId;

export const selectScratchReplyIds = (state: RootState) =>
  state.scratchPage.replyIds;

export const selectScratchIsLoading = (state: RootState) =>
  state.scratchPage.isLoading;

export const selectScratchById = (state: RootState, id: number) =>
  state.scratchPage.scratches[id];

export default scratchSlice.reducer;
