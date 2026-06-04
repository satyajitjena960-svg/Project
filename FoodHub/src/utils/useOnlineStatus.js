import { useState } from "react";

export const useOnlineStatus= ()=>{
    const [isOnline,setIsonline]=useState()

    window.addEventListener("offline",()=>{
       setIsonline(false)
    })
      window.addEventListener("online",()=>{
        setIsonline(true)
    })

    return isOnline; //Boolean value
}