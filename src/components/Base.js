import React,{useContext} from 'react'
import {Link} from "react-router-dom"
import {useHistory} from "react-router-dom"
import {signout} from "../apiCalls/AuthFire"
import {MyContext}  from  "../Context"

function Base({
    name,
    children
}) {

    const {authenticated} = useContext(MyContext)
    let history = useHistory()


const NavigationBar =()=>{

    return(
       <div>
           <ul className="nav nav-tabs" style={{backgroundColor:"#431c5d"}}>
               

               

               {!authenticated ? <> 

               <li className="nav-item" style={{backgroundColor:history.location.pathname === "/login" ? "#d0bdf4" : ""}}>
                   <Link className="nav-link text-white" to="/login">Login</Link>
               </li>

               <li className="nav-item" style={{backgroundColor:history.location.pathname === "/signup" ? "#d0bdf4" : ""}}>
                   <Link className="nav-link text-white" to="signup">Signup</Link>
               </li>
                </> : "" }

               
               {authenticated ? <>
                <li className="nav-item" style={{backgroundColor:history.location.pathname === "/" ? "#d0bdf4" : ""}}>
                   <Link className="nav-link text-white" to="/">Home</Link>
               </li>
               <li className="nav-item" style={{backgroundColor:history.location.pathname === "/friendlist" ? "#d0bdf4" : ""}}>
                   <Link className="nav-link text-white" to="/friendlist">Friends</Link>
               </li>
               <li className="nav-item" style={{backgroundColor:history.location.pathname === "/grouplist" ? "#d0bdf4" : ""}}>
                   <Link className="nav-link text-white" to="/grouplist">Groups</Link>
               </li>
               <li className="nav-item" style={{backgroundColor:history.location.pathname === "/signout" ? "#d0bdf4" : ""}}>
                   <Link className="nav-link text-white" to="/signout">Signout</Link>
               </li>
                
               
               </> : ""}
              
                
           </ul>
       </div>
    )
    
    
}

const Footers = () =>{
    return(
        
<footer className="page-footer font-small" style={{backgroundColor:"#431c5d"}}>


<div className="footer-copyright text-center py-3">© 2020 Copyright:
 
</div>


</footer>

    )
}



    return (
        <div >
        
        <NavigationBar></NavigationBar>
        <div className="container-fluid">
            <div className="row ">
            <div className="col-12">
            <h1 className=" text-center " style={{color:"black"}}>{name}</h1>

            </div>
            </div>
        </div>
        <div className="container-fluid text-white" >
        {children}
       

       <div className="clear"></div>
        <Footers></Footers>
        </div>
        
       

        </div>
    )
}

export default Base
