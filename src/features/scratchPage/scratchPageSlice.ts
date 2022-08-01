import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { normalize } from 'normalizr';
import { RootState } from '../../app/store';
import { getScratchConversation } from '../../axiosApi';
import { scratchEntity } from '../../common/entities';
import { apiError, Scratch } from '../../common/types';
import { addReplyScratch, removeScratch } from '../scratches/scratchesSlice';

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

export interface ScratchState {
  parentChainIds: number[];
  scratchId: number | null;
  replyIds: number[];
  isLoading: boolean;
}

const initialState: ScratchState = {
  parentChainIds: [],
  scratchId: null,
  replyIds: [],
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

      state.isLoading = false;
    });
    builder.addCase(loadScratchConversation.rejected, () => {
      return initialState;
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
      }
    });

    builder.addCase(addReplyScratch.fulfilled, (state, action) => {
      const scratch = action.payload.scratch;

      if (state.scratchId === scratch.parentId) {
        state.replyIds.unshift(scratch.id);
      }
    });
  },
});

export const selectScratchParentChainIds = (state: RootState) =>
  state.scratchPage.parentChainIds;

export const selectScratchMainScratchId = (state: RootState) =>
  state.scratchPage.scratchId;

export const selectScratchReplyIds = (state: RootState) =>
  state.scratchPage.replyIds;

export const selectScratchIsLoading = (state: RootState) =>
  state.scratchPage.isLoading;

export default scratchSlice.reducer;
