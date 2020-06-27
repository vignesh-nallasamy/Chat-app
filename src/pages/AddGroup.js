import React,{useEffect,useState} from 'react'
import Base from "../components/Base"
import {Link,useHistory} from "react-router-dom"
import {auth,db,fireup,storage} from "../firebase/Fire"

function AddGroup() {

    let history = useHistory()

    const [name, setname] = useState("");
    const [file, setfile] = useState(""); 
    const [Current , setCurrent] = useState({
        name : "",
        email : "",
        photoUrl : ""
        
    })
    const [Id,setId] = useState("")
    const [success, setsuccess] = useState(false)
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState(false)

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


    const formSubmit = (e)=>{
            e.preventDefault();
            setloading(true)
            setsuccess(false)
            seterror(false)

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

                        
                        console.log("ippo:: ",error);
                        

               
                    }, function() {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
  
                    db.collection("groups").add({
                        name : name,
                        icon : downloadURL,
                        Messages : [],
                        members :[{
                            name:Current.name,
                            email:Current.email,
                            photoUrl:Current.photoUrl
                        }],
                        admin : auth().currentUser.email
                    }).then(item => {
                        console.log(item.data);
                        setId(item.Id)
                        
                        db.collection("users").doc(auth().currentUser.email).update({
                            
                            groups:fireup.FieldValue.arrayUnion({
                                groupId:item.id,
                                icon:downloadURL,
                                name:name,
                                admin:true,
                            }),
                            ["notifyGroup."+item.id]:0
                        })
                        .then(data => {
                            db.collection("groupNotify").doc(item.id).set({
                                groupId : item.id,
                                name:name,
                                members:[Current.email],
                                total:0
                            })
                            .then(()=>{
                                    console.log("successfully created group");
                            setloading(false)
                            setsuccess(true)
                            setname("")
                            setfile("")
                            })
                            
                            
                        })
                        .catch(err => {console.log(err)
                            setloading(false)

                        seterror(err)}
                        )
                    }).catch(err => {console.log(err)
                        setloading(false)

                        seterror(err.message())})
                   
                   

                    });
                    });
          
    }

    const GroupForm =()=>{

        return(
            <div className="row mt-3">
             
                <div className="col-md-6 offset-3">
                {successMessage()}
            {loadingMessage()}
            {errorMessage()}
                
                
                
                <form className="form text-white mt-5">
                    <div className="form-group">
                        <label style={{color:"black"}}>Group Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e)=>{setname(e.target.value)}} required />
                    </div>
                    
                    <div className="form-group">
                        <label  style={{color:"black"}} >group icon</label>
                        <input type="file" className="form-control" accept="image/*" onChange={(e)=>{setfile(e.target.files[0])}}  required />
                    </div>

                    <div className="form-group">
                        <button type="submit"  onClick={formSubmit} className="btn rounded text-white btn-block" >Create Group</button>
                    </div>
                </form>
                <Link className="btn rounded btn-lg text-white" to="grouplist">Go Back</Link>

                </div>
            </div>
        )
    }
    const successMessage = ()=>(
        success ? (
            <div className="alert alert-success">
                Group Created successfully
                {setTimeout(()=>{
                    history.push("/grouplist")
                },1000)}
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
            {GroupForm()}
           
 
       </Base>
    )
}

export default AddGroup
