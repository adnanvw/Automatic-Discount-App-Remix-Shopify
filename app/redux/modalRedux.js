import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status:false,
  content:"",
  btnContent:"",
  action:"",
  id:""
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state,action) => {
      state.status= true;
      state.content=action.payload.content;
      state.btnContent=action.payload.btnContent;
      state.action=action.payload.action;
      state.id=(action.payload.id !=="")?action.payload.id:""
    },
    closeModal: (state) => {
        state.status = false;
        state.content="";
        state.btnContent="";
        state.action="";
        state.id=""
    },
  },
})

// Action creators are generated for each case reducer function
export const {openModal,closeModal} = modalSlice.actions

export default modalSlice.reducer