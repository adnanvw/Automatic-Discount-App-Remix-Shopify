import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { closeCircular, openCircular } from '~/redux/circularRedux';
import { openModal } from '~/redux/modalRedux';
import { openToast } from '~/redux/toastRedux';
import {setUpdateOfferData} from "~/redux/updateOfferData"
import ModalExample from './ModalComp';

const ViewDiscounts = () => {

  const [discountData, setDiscountData] = useState([]);

  const [refresh, setRefresh] = useState(false)

  const reduxDispatch=useDispatch()

  const getDiscounts = async () => {
    reduxDispatch(openCircular())
    const response = await fetch("/api/getDiscounts", {
      method: "GET",
    })
    if (response.status >= 200 && response.status <= 299) {
      const jsonData = await response.json()
      setDiscountData(jsonData.discountArray);
      reduxDispatch(closeCircular())
    }
    else {
      const jsonData = await response.json()
      console.log(jsonData)
      reduxDispatch(closeCircular())
      reduxDispatch(openToast({ error: true, message: jsonData.error }))
    }
  }

  const handleUpdate=(index)=>{
    const data=discountData[index]
    // console.log("lll",data)
    reduxDispatch(setUpdateOfferData({...data}))
  }
  
  const handleDeleteModal=(index)=>{
    const docId=discountData[index]._id
    const discountId=discountData[index].discountId
     reduxDispatch(openModal({content:"This action cannot be undone.",status:true,btnContent:"Delete",action:"delete",id:{docId,discountId}}))
  }
  
  const handleDelete= async({docId,discountId})=>{
     reduxDispatch(openCircular())
     const response = await fetch("/api/deleteDiscount", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({docId,discountId})
    })
    if (response.status >= 200 && response.status <= 299) {
      const jsonData = await response.json()
      setRefresh(!refresh)
      reduxDispatch(closeCircular())
      reduxDispatch(openToast({ error: false, message: jsonData.success }))
    }
    else {
      const jsonData = await response.json()
      console.log(jsonData)
      reduxDispatch(closeCircular())
      reduxDispatch(openToast({ error: true, message: jsonData.error }))
    }
  }

  useEffect(() => {
    getDiscounts()
  }, [refresh])



  return (
    <>
      {
        discountData.length ?
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Discount Title</th>
                <th scope="col">Customer Buy Product</th>
                <th scope="col">Customer Get Product</th>
                <th scope="col">Discount Type</th>
                <th scope="col">Discount Value</th>
                <th scope="col">Discount End Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            {
              discountData.map((item,index) => {
                return (
                  <tbody>
                    <tr>
                      <td >{item?.discountTitle}</td>
                      <td>{item?.customerBuyProductName}</td>
                      <td>{item?.customerGetProductName}</td>
                      <td>{item?.discountType.percentage ? "Percentage Type" : "Fixed Amount Type"}</td>
                      <td>{item?.discountValue}</td>
                      <td>{item?.discountEndDate? new Date(item.discountEndDate).toLocaleDateString():"Endless"}</td>
                      <td>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16" style={{ cursor: 'pointer', marginRight:"10px"}} onClick={()=>handleUpdate(index)}>
                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16" style={{ cursor: 'pointer'}} onClick={()=>handleDeleteModal(index)}>
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                      </td>
                    </tr>
                  </tbody>
                )
              })
            }
          </table>
          :
          <h2 style={{ color: "red", textAlign: "center", width: "100%" }}>Data Not Found</h2>
      }
    <ModalExample handleDelete={handleDelete}/>
    </>
  )
}

export default ViewDiscounts
