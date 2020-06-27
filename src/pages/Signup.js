import React,{useState} from 'react'
import {Redirect} from "react-router-dom"
import Base from "../components/Base"
import {auth,db,storage} from "../firebase/Fire.js"
import {Link} from "react-router-dom"

function Signup() {

    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [file,setfile] = useState("")
    const [err , setErr] = useState("")
    const [loading, setLoading] = useState(false)


     const formSubmit =(e)=>{
        e.preventDefault();
        
        

        setLoading(true);
        setErr(false)


        auth().createUserWithEmailAndPassword(email,password)
        .then((user)=>{
            
            if(user)
            {
                var metadata = {
                    contentType: file.type
                  };
                  var rand = (Math.floor(Math.random()*100)).toString()
                var uploadTask = storage.child(`images/${rand}${file.name}`).put(file,metadata)

    
                    uploadTask.on("state_changed", 
                    function(snapshot) {
                    
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case "paused": 
                        console.log('Upload is paused');
                        break;
                        case "running": 
                        console.log('Upload is running');
                        break;
                    }
                    }, function(error) {

                        setErr(error);
                        setLoading(false)
                        console.log("ippo:: ",error);
                        

               
                    }, function() {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    
                    
                     db.collection("users").doc(user.user.email).set({
                        name,
                        email,
                        password,
                        photoUrl:downloadURL,
                        friends:[],
                        notify:{
                            test : 12
                        },
                        notifyGroup:{

                        },
                        online:true,
                        groups:[]
                    })
                    .then(function(usereyyy){
                        alert("account Successfully created")
                        return (<Redirect to='/chat'  />)
                       
                    }
                    
                    )
                    .catch(err =>{
                        setErr(err)
                        console.log(err);
                        
                    })

                    });
                    });



            }
            else
            {
                console.log("user Not created")
                setErr("user Not created")
                setLoading(false)
            }
        })
        .catch(err => {
    console.log("ERRRR:  ",err)
    setErr(err.message)
    setLoading(false)})



    }

    const LoadingMessage = ()=>{
        return(
            loading ? <div className="alert alert-warning">
                <p>Creating Account...</p>
            </div> : ""
        )
    }

    const ErrorMessage = ()=>{
        return(
            err ? <div className="alert alert-danger">
                <p>{err}</p>
            </div> : ""
        )
    }


   


    const SignupForm =()=>{

        return(
            <div className="row mt-3">
             
                <div className="col-md-6 offset-3">
                {LoadingMessage()}
                {ErrorMessage()}
                
                
                <form className="form text-white">
                    <div className="form-group">
                        <label style={{color:"black"}}>Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e)=>{setname(e.target.value)}} required />
                    </div>
                    <div className="form-group">
                        <label style={{color:"black"}}>Email</label>
                        <input type="text" className="form-control" required  onChange={(e)=>{setemail(e.target.value)}} value={email} />
                    </div>
                    
                    <div className="form-group">
                        <label style={{color:"black"}}>Password</label>
                        <input type="password" className="form-control" required  onChange={(e)=>{setpassword(e.target.value)}} value={password} />
                    </div>
                    <div className="form-group">
                        <label style={{color:"black"}}>Profile Photo</label>
                        <input type="file" className="form-control" onChange={(e)=> {setfile(e.target.files[0])}} required />
                    </div>

                    <div className="form-group">
                        <button type="submit"  onClick={formSubmit} className="btn rounded text-white btn-block" >Sign Up</button>
                    </div>
                </form>
                <div className="text-center ">
                    <p style={{color:"black"}}> Own an Account? Then <Link to="/login" className="text-info">Login</Link> here</p>
                </div>

                </div>
            </div>
        )
    }

    return (
        <Base name="Signup Page">
          {SignupForm()}
        </Base>
    )
}

export default Signup
