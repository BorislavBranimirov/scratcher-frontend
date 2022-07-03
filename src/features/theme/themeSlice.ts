import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  isThemeAccent,
  isThemeBackground,
  themeAccent,
  themeBackground,
} from '../../common/types';

export interface ThemeState {
  accent: themeAccent;
  background: themeBackground;
}

const localStorageThemeAccent = localStorage.getItem('themeAccent');
const localStorageThemeBackground = localStorage.getItem('themeBackground');

const initialState: ThemeState = {
  accent: isThemeAccent(localStorageThemeAccent)
    ? localStorageThemeAccent
    : 'theme-accent-blue',
  background: isThemeBackground(localStorageThemeBackground)
    ? localStorageThemeBackground
    : 'theme-background-dark',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setAccentTheme: (state, action: PayloadAction<themeAccent>) => {
      state.accent = action.payload;
    },
    setBackgroundTheme: (state, action: PayloadAction<themeBackground>) => {
      state.background = action.payload;
    },
  },
});

export const { setAccentTheme, setBackgroundTheme } = themeSlice.actions;

export const selectThemeAccent = (state: RootState) => state.theme.accent;

export const selectThemeBackground = (state: RootState) =>
  state.theme.background;

export default themeSlice.reducer;
