import { configureStore } from '@reduxjs/toolkit'
import shopInfoReducer from './shopInfoReducer.js'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import { combineReducers } from '@reduxjs/toolkit';
import toastReducer from './toastRedux.js'
import circularReducer from './circularRedux.js';
import modalReducer from './modalRedux';
import updateOfferDataReducer from './updateOfferData';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({ 
        shopData:shopInfoReducer,
        toast: toastReducer,
        circular:circularReducer,
        modal:modalReducer,
        updateOfferData:updateOfferDataReducer   
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})

export const persistor = persistStore(store)

