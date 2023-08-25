import {Toast, Frame, Page, Button} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import {useDispatch} from "react-redux"
import { closeToast } from '../redux/toastRedux';
import { useSelector } from 'react-redux';

const ToastExample = ()=>{
const dispatch=useDispatch();
 
  const {open,message,error}=useSelector((state)=>state.toast)
  
  console.log("open",open)
  
  const dismissToast=()=>{
    dispatch(closeToast())
  }

  setTimeout(() => {
     dismissToast()
  }, 3000);
  
  const toastMarkup =  (
    <Toast content={message} onDismiss={dismissToast} error={error}/>
  ) 

  return (
    <div style={{height: '250px',display:open?"block":"none"}}>
      <Frame>
          {open?toastMarkup:null}
      </Frame>
    </div>
  );
}

export default ToastExample