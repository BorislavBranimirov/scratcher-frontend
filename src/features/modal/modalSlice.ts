import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { getScratch, postScratch } from '../../axiosApi';
import {
  PostReplyRequestObj,
  PostRescratchRequestObj,
  Scratch,
  ScratchResponseObj,
} from '../../common/types';

export const openReplyModal = createAsyncThunk<
  ScratchResponseObj,
  { parentId: number },
  { rejectValue: string; state: RootState }
>('modal/openReplyModal', async (args, thunkApi) => {
  const isLogged = thunkApi.getState().auth.user !== null;
  if (!isLogged) {
    return thunkApi.rejectWithValue('Log in to reply.');
  }

  try {
    const res = await getScratch(args.parentId);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const replyToScratch = createAsyncThunk<
  ScratchResponseObj,
  PostReplyRequestObj,
  { rejectValue: string }
>('modal/addReply', async (args, thunkApi) => {
  try {
    const scratchId = (await postScratch(args)).data.id;

    const res = await getScratch(scratchId);

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const openRescratchModal = createAsyncThunk<
  ScratchResponseObj,
  { rescratchedId: number },
  { rejectValue: string; state: RootState }
>('modal/openRescratchModal', async (args, thunkApi) => {
  const isLogged = thunkApi.getState().auth.user !== null;
  if (!isLogged) {
    return thunkApi.rejectWithValue('Log in to rescratch.');
  }

  try {
    const res = await getScratch(args.rescratchedId);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export const addQuoteRescratch = createAsyncThunk<
  ScratchResponseObj,
  PostRescratchRequestObj,
  { rejectValue: string }
>('modal/addQuoteRescratch', async (args, thunkApi) => {
  try {
    const scratchId = (await postScratch(args)).data.id;

    const res = await getScratch(scratchId);

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue(err.response.data.err);
    }
    return Promise.reject(err);
  }
});

export interface ModalState {
  show: boolean;
  type: 'reply' | 'rescratch' | null;
  scratchId: number | null;
  scratches: { [key: string]: Scratch };
}

const initialState: ModalState = {
  show: false,
  type: null,
  scratchId: null,
  scratches: {},
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    closeModal: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(openReplyModal.fulfilled, (state, action) => {
      state.show = true;
      state.type = 'reply';
      state.scratchId = action.payload.scratch.id;
      state.scratches = {
        [action.payload.scratch.id]: action.payload.scratch,
        ...action.payload.extraScratches,
      };
    });

    builder.addCase(openRescratchModal.fulfilled, (state, action) => {
      state.show = true;
      state.type = 'rescratch';
      state.scratchId = action.payload.scratch.id;
      state.scratches = {
        [action.payload.scratch.id]: action.payload.scratch,
        ...action.payload.extraScratches,
      };
    });

    builder.addMatcher(
      isAnyOf(replyToScratch.fulfilled, addQuoteRescratch.fulfilled),
      () => {
        return initialState;
      }
    );
  },
});

export const { closeModal } = modalSlice.actions;

export const selectModal = (state: RootState) => state.modal;

export const selectModalScratchById = (state: RootState, id: number) =>
  state.modal.scratches[id];

export default modalSlice.reducer;
