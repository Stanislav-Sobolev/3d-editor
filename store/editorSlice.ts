import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ObjectState {
  width: number;
  height: number;
}

interface EditorState {
  selectedPlaneIndex: number | null;
  objects: Record<number, ObjectState>;
  history: ObjectState[];
}

const initialState: EditorState = {
  selectedPlaneIndex: null,
  objects: {
    1: {
      width: 2,
      height: 1,
    },
    2: {
      width: 1,
      height: 3,
    },
  },
  history: [],
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setSelection: (state, action: PayloadAction<number | null>) => {
      state.selectedPlaneIndex = action.payload;
    },
    deselect: (state) => {
      state.selectedPlaneIndex = null;
    },
    setWidth: (state, action: PayloadAction<number>) => {
      if (state.selectedPlaneIndex !== null) {
        const prevObjectState = { ...state.objects[state.selectedPlaneIndex] };
        state.history.push(prevObjectState);
        state.history = state.history.slice(-20);
        
        state.objects[state.selectedPlaneIndex].width = action.payload;
      }
    },
    setHeight: (state, action: PayloadAction<number>) => {
      if (state.selectedPlaneIndex !== null) {
        const prevObjectState = { ...state.objects[state.selectedPlaneIndex] };
        state.history.push(prevObjectState);
        state.history = state.history.slice(-50);
        
        state.objects[state.selectedPlaneIndex].height = action.payload;
      }
    },
    undo: (state) => {
      if (state.history.length > 0) {
        const prevState = state.history.pop();
        if (state.selectedPlaneIndex !== null && prevState) {
          state.objects[state.selectedPlaneIndex] = prevState;
        }
      }
    },
  },
});

export const { setSelection, deselect, setWidth, setHeight, undo } = editorSlice.actions;

export default editorSlice.reducer;
