import React, { useEffect } from 'react'
import { socket } from "./socket.js"

const App = () => {






  useEffect(() => {

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("connect", () => {
      console.log('connected', socket.id);
    });

    socket.on("addDiscountedProduct", (payload) => {
      fetch(`https://${Shopify.shop}/cart/add.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'id': payload.split("/")[4],
          'quantity': 1
        })
      }).then(() => {
        // window.location.replace(`https://${shopName}/cart`)
        window.location.reload()
      }).catch((error) => {
        console.log("error", error)
      })
    })
  }, [])

  return (
    <></>
  )
}

export default App