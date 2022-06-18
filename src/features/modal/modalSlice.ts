import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { getScratch } from '../../axiosApi';
import { apiError, ScratchResponseObj } from '../../common/types';

export const openPostModal = createAsyncThunk<
  void,
  undefined,
  { rejectValue: string; state: RootState }
>('modal/openPostModal', async (_, thunkApi) => {
  const isLogged = thunkApi.getState().auth.userId !== null;
  if (!isLogged) {
    return thunkApi.rejectWithValue('Log in to post.');
  }
});

export const openReplyModal = createAsyncThunk<
  ScratchResponseObj,
  { parentId: number },
  { rejectValue: string; state: RootState }
>('modal/openReplyModal', async (args, thunkApi) => {
  const isLogged = thunkApi.getState().auth.userId !== null;
  if (!isLogged) {
    return thunkApi.rejectWithValue('Log in to reply.');
  }

  try {
    const res = await getScratch(args.parentId);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export const openRescratchModal = createAsyncThunk<
  ScratchResponseObj,
  { rescratchedId: number },
  { rejectValue: string; state: RootState }
>('modal/openRescratchModal', async (args, thunkApi) => {
  const isLogged = thunkApi.getState().auth.userId !== null;
  if (!isLogged) {
    return thunkApi.rejectWithValue('Log in to rescratch.');
  }

  try {
    const res = await getScratch(args.rescratchedId);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      return thunkApi.rejectWithValue((err.response.data as apiError).err);
    }
    return Promise.reject(err);
  }
});

export interface ModalState {
  show: boolean;
  type: 'post' | 'reply' | 'rescratch' | null;
  scratchId: number | null;
}

const initialState: ModalState = {
  show: false,
  type: null,
  scratchId: null,
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
    builder.addCase(openPostModal.fulfilled, (state) => {
      state.show = true;
      state.type = 'post';
    });

    builder.addCase(openReplyModal.fulfilled, (state, action) => {
      state.show = true;
      state.type = 'reply';
      state.scratchId = action.payload.scratch.id;
    });

    builder.addCase(openRescratchModal.fulfilled, (state, action) => {
      state.show = true;
      state.type = 'rescratch';
      state.scratchId = action.payload.scratch.id;
    });
  },
});

export const { closeModal } = modalSlice.actions;

export const selectModalShow = (state: RootState) => state.modal.show;

export const selectModalType = (state: RootState) => state.modal.type;

export const selectModalScratchId = (state: RootState) => state.modal.scratchId;

export const selectModalScratch = (state: RootState) =>
  state.modal.scratchId
    ? state.scratches.entities[state.modal.scratchId]
    : null;

export default modalSlice.reducer;
