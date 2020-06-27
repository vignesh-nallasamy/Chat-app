
import {auth,db} from "../firebase/Fire"
import { Redirect, useHistory } from "react-router-dom"

export const signout = ()=>{

 
    db.collection("users").doc(auth().currentUser.email).update({
        online:false
    }).then(()=>{
        auth().signOut().then(()=>{
            console.log("Signed out Successfully")
        })
    })

}