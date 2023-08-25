import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  open:false,
  error:false,
  message:""
}

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    openToast: (state,action) => {
      state.open = true;
      state.error= action.payload.error;
      state.message=action.payload.message
    },
    closeToast: (state) => {
        state.open = false;
        state.error=false ;
        state.message=""
    },
  },
})

// Action creators are generated for each case reducer function
export const {openToast,closeToast} = toastSlice.actions

export default toastSlice.reducer