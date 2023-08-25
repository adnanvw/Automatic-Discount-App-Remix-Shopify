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

    socket.emit("customEvent","Hello World Buddy")

    socket.on("responseEvent",(payload)=>{
       console.log("***Payload socket",payload)
    })
  }, [])

  return (
    <div>App</div>
  )
}

export default App