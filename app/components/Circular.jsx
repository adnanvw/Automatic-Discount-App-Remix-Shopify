import * as React from 'react';
import {Spinner} from '@shopify/polaris';
import "./circular.css"
import { useSelector } from 'react-redux';
import {useDispatch} from "react-redux"
const Circular = () => {
  const{circularStatus} = useSelector(state=>state.circular)
  return (
    <>
    {circularStatus &&
      <div id="spinner">
         <Spinner size='large'/>
    </div>}
    </>
  )
}

export default Circular