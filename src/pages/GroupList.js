import React,{useState,useEffect} from 'react'
import Base from "../components/Base"
import {Link,useHistory} from "react-router-dom"
import {auth,db,fireup} from "../firebase/Fire"




function GroupList() {

    var history = useHistory()
 
    const [Current , setCurrent] = useState({
        name : "",
        email : "",
        photoUrl : "",
        groups:"",
        notifyGroup:""
    })
    const [notifications, setNotifications] = useState("")


    const preload = async()=>{

        const current = await auth().currentUser
    
        db.collection("users").doc(current.email).get()
        .then(item => {
            if(item.exists)
            {
    
                setCurrent({
                    ...Current,name:item.data().name,email:item.data().email,photoUrl:item.data().photoUrl,groups:item.data().groups,notifyGroup:item.data().notifyGroup
                })
            }
            else{
                console.log("current user Not Available");
                
            }
        })
        .catch(err => {
            console.log(err);
            
        })
    
    }
    
    useEffect(()=>{
        preload()
    },[])

    useEffect(()=>{
        db.collection("groupNotify").where("members","array-contains",Current.email).get()
        .then(results => {
            
            results.forEach(doc => {
               
                setNotifications({...notifications,[doc.data().groupId]:doc.data().total})
                
            })
        })
        .catch(err => console.log(err)
        )
    },[Current.email])

    const notification = (value,Id) => {
       
       let total = value;
        if(notifications[Id])
        {
            
            total = notifications[Id]
        }

        let diff = total - value;

       if( diff > 0)
       {
           return(
               <button className="btn btn2 send  ">{diff}</button>
           )
       }
       else{
          
           
           return("")
       }
} 







    const list = ()=>{
        
        if(Current.groups.length > 0)
        {
                return(<div className="row">
                <div className="col-3 text-center">
                    <div className="row">
                        <div className="col-12 ml-3">
                <div className="col-4 text-center"><Link  to="/addgroup" className="btn  rounded">Create Group</Link></div>
    
    
                        </div>
                    </div>
                </div>
                <div className="col-6 ">
                    <ul className="list-group fix" >
                        { Current.groups.map(item => (
                            <li key={item.groupId} className="list-group-item friend" style={{color:"black"}}>
                                <div className="row">
                                    <div className="col-2" style={{  
        backgroundImage: "url(" + item.icon+ ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',height:"100px"
        }}>
                                         
                                    </div>
                                    <div className="col-7 "  onClick={() => history.push(`/group/${item.groupId}`)}>
                                         <div className="row select">
                                             <div className="col">
                                                 <p className="lead">{item.name}</p>
                                             </div>
                                         </div>
                                         
                                    </div>
                                    <div className="col-2">
                                    {notification(Current.notifyGroup[item.groupId],item.groupId)}

                                    </div>
                                    
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="text-center mt-3">
                    <Link className="btn rounded btn-lg text-white" to="/">Go Back</Link>
        
                    </div>
                </div>
               
        
            </div>)
        }
        else{
    
            return(
    
                <div className="row">
                 <div className="col-3 text-center">
                    <div className="row">
                        <div className="col-12 ml-3">
                <div className="col-4 text-center"><Link  to="/addgroup" className="btn  rounded">Create New Group</Link></div>
    
    
                        </div>
                    </div>
                </div>
        <div className="col-6">
            <h1 className="text-center">you are in no group</h1>
            <div className="text-center mt-3">
            <Link className="btn  rounded btn-lg text-white" to="/">Go Back</Link>
    
            </div>
        </div>
    
    </div>
            )
    
        }
    }



    return (
        <Base name="My Groups">
            {list()}
        </Base>
    )
}

export default GroupList
