import React, { Component, useState } from 'react'

export default class Help2 extends Component {

  constructor(name){
    super()   
    this.a=10
  }

  componentDidMount(){
    console.log("Component DiD Mount")
  }  //useEffect , API calling
  componentDidUpdate(){
   console.log("Component DiD Update")
  }
  componentWillUnmount(){
    console.log("Component DiD Unmount")
  }


  render() {
    return (
      <div>
        <h1>I am Class Comp. {this.a}</h1>
        <button onClick={()=>{this.a=this.a+1; this.forceUpdate()}}>Update</button>
      </div>
    )
  }
}
