import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './editorSlice';

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: {
    editor: editorReducer,
  },
});
