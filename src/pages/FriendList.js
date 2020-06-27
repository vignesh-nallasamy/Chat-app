import React,{useState,useEffect} from 'react'
import Base from "../components/Base"
import {auth,db} from "../firebase/Fire"
import {Link,useHistory} from "react-router-dom"

function FriendList() {

   const history = useHistory()
    
    const [Current , setCurrent] = useState({
        name : "",
        email : "",
        photoUrl : "",
        friends :[],
        notify:{}
    })


    const preload = async()=>{

        const current = await auth().currentUser
    
        db.collection("users").doc(current.email).get()
        .then(item => {
            if(item.exists)
            {
    
                setCurrent({
                    ...Current,name:item.data().name,email:item.data().email,photoUrl:item.data().photoUrl,friends:item.data().friends,notify:item.data().notify
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

        db.collection("users").doc(auth().currentUser.email)
        .onSnapshot(function(doc) {
           
            
            setCurrent({...Current,name:doc.data().name,email:doc.data().email,photoUrl:doc.data().photoUrl,friends:doc.data().friends,notify:doc.data().notify})
        });
    },[])

    const notifications = (data) => {
            var data1 = data.replace(".","q");
            var data2 = data1.replace(".","q")
           if(Current.notify[data2] > 0)
           {
               return(
                   <button className="btn btn2 send  ">{Current.notify[data2]}</button>
               )
           }
           else{
               return("")
           }
    } 

    const list = ()=>{
        
        
        if(Current.friends.length > 0)
        {
                return(<div className="row">
                <div className="col-3 text-center">
                    <div className="row">
                        <div className="col-12 ml-3">
                <div className="col-4 text-center"><Link  to="/addfriend" className="btn  rounded">Add Friend</Link></div>


                        </div>
                    </div>
                </div>
                <div className="col-6  " >
                    <ul className="list-group rounded  " >
                        { Current.friends.map(item => (
                            !item.blocked? (
                                <li key={item.email} className="list-group-item friend" style={{color:"black"}} >
                                <div className="row">
                                    <div className="col-2" style={{  
        backgroundImage: "url(" + item.photoUrl+ ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
        }}>
                                         
                                    </div>
                                    <div className="col-7 "  onClick={() => history.push(`/chat/${item.email}/${item.chat}`)}>
                                         <div className="row select">
                                             <div className="col">
                                                 <p className="lead">{item.name}</p>
                                             </div>
                                         </div>
                                         <div className="row select">
                                             <div className="col">
                                                 <p className="lead ">{item.email}</p>
                                             </div>
                                         </div>
                                    </div>
                                    <div className="col-2">
                                    {notifications(item.chat)}

                                    </div>
                                </div>
                            </li>
                            ): ("")
                        ))}
                    </ul>
                    <div className="text-center mt-3">
                    <Link className="btn rounded  btn-lg text-white" to="/">Go Back</Link>
        
                    </div>
                </div>
        
            </div>)
        }
        else{

            return(

                <div className="row">
                <div className="col-3 text-center">
                    <div className="row mt-5">
                        <div className="col-12 ml-3">
                <div className="col-4 text-center"><Link  to="/addfriend" className="btn rounded">Add Friend</Link></div>


                        </div>
                    </div>
                    </div>
        <div className="col-6">
            <h1 className="text-center">No Friends in the list </h1>
            <div className="text-center mt-3">
            <Link className="btn  rounded  btn-lg text-white" to="/">Go Back</Link>

            </div>
        </div>

    </div>
            )

        }
}

    return (
        <Base name="My Friends">
         {list()}

        </Base>
    )
}

export default FriendList
