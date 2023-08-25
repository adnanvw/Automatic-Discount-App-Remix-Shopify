import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  circularStatus:false,
}

export const circularSlice = createSlice({
  name: 'circular',
  initialState,
  reducers: {
    openCircular: (state) => {
      state.circularStatus= true;
    },
    closeCircular: (state) => {
        state.circularStatus = false;
    },
  },
})

// Action creators are generated for each case reducer function
export const {openCircular,closeCircular} = circularSlice.actions

export default circularSlice.reducer