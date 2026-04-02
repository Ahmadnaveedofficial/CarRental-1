import { Navigate } from "react-router-dom";

import React from 'react'
import { useAppContext } from "../../context/AppContext";

const ProtectedOwnerRoute = ({children}) => {
    const {user,isOwner,loading} =useAppContext();
    if(loading){
        return <div>Loading...</div>
    }
    if(!user || !isOwner){
        return <Navigate to='/'/>
    }
  return children
};


export default ProtectedOwnerRoute