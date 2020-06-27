import React,{useState,useContext,useEffect} from 'react'
import Base from "../components/Base"
import {db,auth} from "../firebase/Fire"
import Card from "../components/Card"
import {Link,withRouter} from "react-router-dom"

function Home() {

    
 
const [reload, setReload] = useState(false)


const [user, setUser] = useState({
    name:"",
    email:"",
    photoUrl:""
})

const {name,email,photoUrl} = user

 const  getUser = async ()=>{
    
    const temp =  auth().currentUser 

    
    
    
    await db.collection("users").doc(temp.email).get()
    .then(item => {
         
        if(item.exists)
        {
            const {name,email,photoUrl} = item.data()
            setUser({...user,name:name,email:email,photoUrl:photoUrl})
            
        }
        else
        {
            console.log("undefiend User");
            setReload(!reload)
            
        }
    })
    .catch(err => {
        console.log("home Error ",err);
        
    })
    
    

}


useEffect(() => {
    
    getUser()
}, [reload])



 
    
    return (
        <Base name="My profile" >
        
            <div className="row mt-5">
                <div className="col-6 offset-3">
                
                    <Card name={name} email={email} photoUrl={photoUrl}></Card>
                    <div className="row mt-3">
                        
                        <div className="col-4 text-center"><Link to="/friendlist" className="btn  rounded">Friend List</Link></div>
                        <div className="col-4 text-center"><Link to="/grouplist" className="btn rounded">Chat Groups</Link></div>
                        <div className="col-4 text-center"><Link to="/blocklist" className="btn rounded">Blocks</Link></div>
                        
                    </div>
                </div>
            </div>
        </Base>
    )
}

export default withRouter(Home)
