import React,{useState,useEffect} from 'react'
import Base from "../components/Base"
import {db,auth,fireup} from "../firebase/Fire"
import Card from "../components/Card"
import {Link} from "react-router-dom"

function AddFriend() {
const [irukka,setIrukka] = useState("")
const [Current , setCurrent] = useState({
    name : "",
    email : "",
    photoUrl : "",
    friends :[]
})
const [user,setUser] =  useState({
    name : "",
    email : "",
    photoUrl : ""
})
const [email, setemail] = useState("")
const [loading, setloading] = useState("")
const [success, setsuccess] = useState("")
const [error,setError] = useState("")

const preload = async()=>{

    const current = await auth().currentUser

    db.collection("users").doc(current.email).get()
    .then(item => {
        if(item.exists)
        {

            setCurrent({
                ...Current,name:item.data().name,email:item.data().email,photoUrl:item.data().photoUrl,friends:item.data().friends
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
        
        
        setCurrent({...Current,name:doc.data().name,email:doc.data().email,photoUrl:doc.data().photoUrl,friends:doc.data().friends})
    });
},[])

const FindUser = (e)=>{

    e.preventDefault()
    setError("");
    setsuccess("");

if(email)
{
    db.collection("users").doc(email).get()
    .then((item)=>{
        if(item.exists)
        {
            const {name,email,photoUrl} = item.data()
            setUser({
                ...user,
                name:name,
                email:email,
                photoUrl:photoUrl
            })
            setIrukka(1)

        }
        else
        {
            setIrukka(2)
        }
    })
    .catch(err => console.log("edededddddd:",err)
    )
}
else
{
    setError("enter the valid email")
    console.log("enter thhe valid email");
    

}
    
    
}


    const SearchForm =()=>{
        
        return(

            <div className="row mt-3">
                <div className="col-md-6 offset-3" style={{border:"1px solid black"}}>
                
                
                <form className="form text-white ">
                    
                    <div className="form-group">
                        <label style={{color:"black"}}>Email</label>
                        <input type="text" className="form-control" required  onChange={(e)=>{setemail(e.target.value)}} value={email} />
                    </div>

                    <div className="form-group">
                        <button onClick={FindUser} type="submit" className="btn btn-success rounded btn-block">Search User</button>
                    </div>
                    

                    
                </form>
               

                </div>

                
            </div>
        )
    }

    const Duplicate =()=>{
        var count = 0
        if(Current.friends.length > 0)
        {
            Current.friends.forEach((friend => {
                
                if (friend.email == user.email)
                { 
                
                    count = count+1
                }
            }))
        }
           
            return count
            
    }

    const makeFriend=()=>{
            setloading(true)
            setsuccess(false)
            setError(false)
            
            
            if(Duplicate() === 0)
            {
                let chat = Current.email + user.email;
               
                
                db.collection("chats").doc(chat).set({
                    firstName:Current.name,
                    firstEmail:Current.email,
                    secondname:user.name,
                    secondEmail:user.email,
                    Messages:[]
                    }
                )
                .then(docs => {
                    console.log("common doc Created");
                    
                    db.collection("users").doc(Current.email).update({
                        friends:fireup.FieldValue.arrayUnion({
                            name:user.name,
                            email:user.email,
                            photoUrl:user.photoUrl,
                            chat:chat,
                            blocked:false
                            
                        }),
                        

                    })
                    .then(data => {
                        console.log("added in ur frndList ")
                        db.collection("users").doc(user.email).update({
                            friends:fireup.FieldValue.arrayUnion({
                                name:Current.name,
                                email:Current.email,
                                photoUrl:Current.photoUrl,
                                chat:chat
                                
                            })
                        })
                        .then(junk => {
                            console.log("everything updated successfully")
                            setsuccess(true)
                            setloading(false)
                            
                        })
                        .catch(err => console.log("cannot update sencond Document ",err))
                        
                    }
                        
                    )
                    .catch(err => console.log("error in adding in ur frndlist ",err))
                })
                .catch(
                    err => console.log("cannot create common document  ::",err)
                    
                )
                
               
            }
            else{
                setError("This user is already in your Friendlist")
                  
                setloading(false)
            }
            
            
            
        
    }



    const result = ()=>{

       return( !irukka ? (
            <p className="lead  " style={{color:"black"}}><span className="badge badge-success mr-2">Hint:</span> Input the email of your Friend</p>
        ) : irukka === 1 ? (
           
            <div>
            <Card name={user.name} email={user.email} photoUrl={user.photoUrl}></Card>
            <button onClick={makeFriend} className="btn  rounded btn-block btn-lg mt-3">Add To FriendList</button>

            </div>
            
            
        ):( 
            <h1 className="text-danger">User Not Found</h1>
        )
        )
       

    }

    const successMessage = ()=>(
        success ? (
            <div className="alert alert-success">
                Added to your FriendList
            </div>
        ) : ""
    )

    const errorMessage = ()=>(
        error ? (
            <div className="alert alert-danger">
                {error}
            </div>
        ) : ""
    )

    const loadingMessage = ()=>(
        loading ? (
            <div className="alert alert-warning">
                Loading...
            </div>
        ) : ""
    )



    




    return (
        <Base>

           {SearchForm()}
           <div className="row mt-5">
             
            <div className="col-md-6 offset-3 text-center" >
            {successMessage()}
            {loadingMessage()}
            {errorMessage()}
            {result()}
            <Link className="btn  btn-lg text-white mt-2" to="friendlist">Go Back</Link>
            
            </div>
            </div>
           
        </Base>
    )
}

export default AddFriend
