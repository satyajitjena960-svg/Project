import React, { useEffect, useState } from 'react'

const Example = () => {
let a=1
//useState()
const [x,setX]=useState(100)

//useEffect
useEffect(()=>{
    console.log("hello")
})

  return (
    <div>
      <h1>Hooks</h1>
      <h2>count : {x}</h2>
      <button>Click</button>
    </div>
  )
}

export default Example
