import React,{useState,useEffect} from 'react'
import Base from "../components/Base"
import {auth,db} from "../firebase/Fire"
import {Link,useHistory} from "react-router-dom"
function BlockList() {
    let history = useHistory()
    const [Current , setCurrent] = useState({
        name : "",
        email : "",
        friends :[],
       
    })

    const preload = async()=>{

        const current = await auth().currentUser
    
        db.collection("users").doc(current.email).get()
        .then(item => {
            if(item.exists)
            {
    
                setCurrent({
                    ...Current,name:item.data().name,email:item.data().email,friends:item.data().friends,
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

    const unBlock = async(friendemail)=>{

        let newList = await Current.friends.map((item)=>{
            if(item.email === friendemail)
            {
                item.blocked = false
            }
            return(item)

        })

        db.collection("users").doc(Current.email).update({
            friends:newList
        })
        .then(()=>{
            alert("unblocked");
            setTimeout(()=>{
                history.push("/")
            },1000)
            
        })

    }

    const list = ()=>{
        
        
        if(Current.friends.length > 0)
        {
                return(<div className="row">
               
                <div className="col-6  offset-3">
                    <ul className="list-group">
                        { Current.friends.map(item => (
                            item.blocked? (
                                <li key={item.email} className="list-group-item friend" style={{color:"black"}}>
                                <div className="row">
                                    <div className="col-2" style={{  
        backgroundImage: "url(" + item.photoUrl+ ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
        }}>
                                         
                                    </div>
                                    <div className="col-7 "  >
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
                                    <div className="col-3 text-center">
                                        <button  onClick={()=>{unBlock(item.email)}} className="btn btn2 rounded mt-2" >Unblock</button>
                                    </div>
                                   
                                </div>
                            </li>
                            ): ("")
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
                <div className="col-4 text-center"><Link  to="/addfriend" className="btn btn2 rounded">Add Friend</Link></div>


                        </div>
                    </div>
                    </div>
        <div className="col-6">
            <h1 className="text-center">No Friends in the list </h1>
            <div className="text-center mt-3">
            <Link className="btn rounded btn-lg text-white" to="/">Go Back</Link>

            </div>
        </div>

    </div>
            )

        }
}
    return (
        <Base name="Blocked Friends">
            {list()}
        </Base>
    )
}

export default BlockList
