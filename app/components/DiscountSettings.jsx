import React from 'react'
import { useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeCircular, openCircular } from '~/redux/circularRedux'
import { openToast } from '~/redux/toastRedux'
import { resetUpdateOfferData } from '~/redux/updateOfferData'
import { useEffect } from 'react'

const DiscountSettings = ({switchTabAfterCreateOrUpdate}) => {

  const reduxDispatch = useDispatch()

  const {isUpdate,updateOfferData}=useSelector(state=>state.updateOfferData)

  const initialDiscountState = {
    discountTitle: "",
    customerBuyProduct: "",
    customerGetProduct: "",
    customerBuyProductName: "",
    customerGetProductName: "",
    customerBuyProductPrice: "",
    customerGetProductPrice: "",
    discountType: {
      percentage: true,
      fixed: false
    },
    discountValue: "",
    discountEndDate: null
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setCustomerBuyProduct':
        return {
          ...state,
          customerBuyProduct: action.value.id,
          customerBuyProductName: action.value.name,
          customerBuyProductPrice: action.value.price,
        }
      case 'setCustomerGetProduct':
        return {
          ...state,
          customerGetProduct: action.value.id,
          customerGetProductName: action.value.name,
          customerGetProductPrice: action.value.price,
        }
      case "percentageType":
        return {
          ...state,
          discountType: {
            ...state.discountType,
            percentage: action.value,
            fixed: !action.value
          }
        }
      case "fixedType":
        return {
          ...state,
          discountType: {
            ...state.discountType,
            fixed: action.value,
            percentage: !action.value
          }
        }
      case "discountValue":
        return {
          ...state,
          discountValue: action.value
        }
      case "discountEndDate":
        return {
          ...state,
          discountEndDate: action.value
        }
      case "discountTitle":
        return {
          ...state,
          discountTitle: action.value
        }
      case "reset":
        return {
          ...initialDiscountState
        }
      case "setForUpdate":
        return {
         ...action.value,
          discountEndDate: action.value.discountEndDate ? action.value.discountEndDate.split('T')[0]:null,
        }
      default:
        return state;
    }
  }

  const [discountState, dispatch] = useReducer(reducer, initialDiscountState);


  const selectProduct = async (e) => {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
    });

    const id = products[0].variants[0].id
    const name = products[0].title
    const price = products[0].variants[0].price


    if (e.target.name == "buyProduct") {
      dispatch({ type: "setCustomerBuyProduct", value: { id, name, price } })
    } else {
      dispatch({ type: "setCustomerGetProduct", value: { id, name, price } })
    }

  }


  const handleChange = (e) => {
    if (e.target.name == "percentage") {
      dispatch({ type: "percentageType", value: e.target.checked })
    } else if (e.target.name == "fixed") {
      dispatch({ type: "fixedType", value: e.target.checked })
    } else if (e.target.name == "discountValue") {
      dispatch({ type: "discountValue", value: e.target.value })
    } else if (e.target.name == "discountEndDate") {
      dispatch({ type: "discountEndDate", value: e.target.value })
    } else if (e.target.name == "discountTitle") {
      dispatch({ type: "discountTitle", value: e.target.value })
    } else {

    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (discountState.discountType.fixed && (Number(discountState.discountValue) > Number(discountState.customerGetProductPrice))) {
      reduxDispatch(openToast({ error: true, message: `Discount Value Should Be Less Than The Product Price (${discountState.customerGetProductPrice}) Of Get Product.` }))
      return
    }
    reduxDispatch(openCircular())
    // console.log("discountState", discountState)
    let bodyVar
    if (isUpdate) {
       bodyVar={
           data:discountState,
           discountId:updateOfferData.discountId,
           docId:updateOfferData._id
       }
    } else {
      bodyVar = {
        data: discountState
      }
    }
    const response = await fetch(!isUpdate ? "/api/createDiscount" : "/api/updateDiscount", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyVar)
    })
    if (response.status >= 200 && response.status <= 299) {
      const jsonData = await response.json()
      console.log(jsonData)
      dispatch({ type: "reset" })
      isUpdate && reduxDispatch(resetUpdateOfferData());
      switchTabAfterCreateOrUpdate()
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
    if(isUpdate){
      dispatch({type:"setForUpdate",value:updateOfferData})
    }
  }, [])
  

  return (
    <>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Discount Code Title</label>
          <input type="text" className="form-control" id="exampleFormControlInput1" onChange={handleChange} name="discountTitle" value={discountState.discountTitle} required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Customer Buy Product</label>
          <input type="text" className="form-control" id="exampleFormControlInput1" onClick={selectProduct} name="buyProduct" value={discountState.customerBuyProductName} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Customer Get Product</label>
          <input type="text" className="form-control" id="exampleFormControlInput1" onClick={selectProduct} name="getProduct" value={discountState.customerGetProductName} required />
        </div>
        <h6>Discount Type</h6>
        <div className="form-check mb-3">
          <input className="form-check-input" type="radio" name="percentage" checked={discountState.discountType.percentage} onChange={handleChange} />
          <label className="form-check-label" >
            Percentage OFF
          </label>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="radio" name="fixed" checked={discountState.discountType.fixed} onChange={handleChange} />
          <label className="form-check-label">
            Fixed Amount OFF
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label">Discount Value</label>
          <input type="text" className="form-control" id="exampleFormControlInput1" onChange={handleChange} name="discountValue" value={discountState.discountValue} required pattern={discountState.discountType.percentage ? "^[1-9][0-9]?$|^100$" : '^[1-9][0-9]*$'} />
        </div>
        <div className="mb-3" style={{ width: "25%" }}>
          <label className="form-label">Discount End Date</label>
          <input type="date" className="form-control" id="exampleFormControlInput1" onChange={handleChange} name="discountEndDate" value={discountState.discountEndDate}
          />
        </div>
        <button type="submit" className="btn btn-primary">{`${!isUpdate?"Create Discount":"Update Discount"}`}</button>
      </form>
    </>
  )
}

export default DiscountSettings