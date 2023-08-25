import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   isUpdate:false,
   updateOfferData:{}
}

export const updateOfferDataSlice = createSlice({
  name: 'updateOfferData',
  initialState,
  reducers: {
    setUpdateOfferData: (state,action) => {
      state.isUpdate=true;
      state.updateOfferData={
        ...action.payload
      }
    },
    resetUpdateOfferData:(state)=>{
        state.isUpdate=false;
        state.updateOfferData={}
    }
  },
})

// Action creators are generated for each case reducer function
export const {setUpdateOfferData,resetUpdateOfferData} = updateOfferDataSlice.actions

export default updateOfferDataSlice.reducer