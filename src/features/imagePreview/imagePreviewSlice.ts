import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ImagePreviewState {
  imageUrl: string | null;
}

const initialState: ImagePreviewState = {
  imageUrl: null,
};

const imagePreviewSlice = createSlice({
  name: 'imagePreview',
  initialState,
  reducers: {
    openImagePreview: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload;
    },
    closeImagePreview: () => {
      return initialState;
    },
  },
});

export const { openImagePreview, closeImagePreview } =
  imagePreviewSlice.actions;

export const selectImagePreviewUrl = (state: RootState) =>
  state.imagePreview.imageUrl;

export default imagePreviewSlice.reducer;
