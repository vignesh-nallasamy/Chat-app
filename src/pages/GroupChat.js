import React,{useState,useEffect,} from 'react'
import Base from "../components/Base"
import InputBox from "../components/InputBox"
import {auth,db,fireup,storage} from "../firebase/Fire"
import {useParams,Link} from "react-router-dom"
import  {readAndCompressImage} from "browser-image-resizer"
import Config from "../apiCalls/Config"
import Emoji from "../components/Emoji"



function GroupChat() {

    const {groupId} = useParams()
    const [loading,setLoading] = useState(false)
    const [recording,setRecording] = useState(false)
    const [emoji,setEmoji] = useState(false)
    const[trigger,setTrigger] = useState(false)
    const[Members,setMembers] = useState([])
    const [Current , setCurrent] = useState({
        name : "",
        email : "",
        photoUrl : ""
        
    })
    const [group , setGroup] = useState({
        name : "",
        icon : "",
        members:[],
        Messages:[],
        admin:""
    })
    const [singleMessage, setsingleMessage] = useState("")


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
    function updateScroll(){
        var element = document.getElementById('qw');
        element.scrollTop = element.scrollHeight;
        }
    
    useEffect(()=>{
        preload()
        
    },[])

    useEffect(()=>{
        updateScroll()
    },[group.Messages])

    useEffect(()=>{
        db.collection("groups").doc(groupId).get()
        .then(doc => {
            setGroup({
                ...group,name:doc.data().name,icon:doc.data().icon,Messages:doc.data().Messages,members:doc.data().members,admin:doc.data().admin
            })

            
           
        })
        .catch(err => console.log(err))
    },[groupId])

    useEffect(()=>{
        db.collection("groups").doc(groupId)
        .onSnapshot(function(doc) {
            setGroup({
                ...group,name:doc.data().name,icon:doc.data().icon,Messages:doc.data().Messages,members:doc.data().members,admin:doc.data().admin
            })
            let Arr = doc.data().members.map(item => item.email)
            setMembers(Arr)
            
        });
    },[])

    useEffect(()=>{
        return ()=>{
            db.collection("groupNotify").doc(groupId).get()
            .then(item => {
                db.collection("users").doc(auth().currentUser.email).update({
                    ["notifyGroup."+groupId]:item.data().total
                })
            })
        }
    },[])


    const insertMessage = (e)=>{
        e.preventDefault();

        if(singleMessage)
        {
            db.collection("groups").doc(groupId).update({
                Messages:fireup.FieldValue.arrayUnion({
                    type:"text",
                    sender:Current.email,
                    name:Current.name,
                    content:singleMessage,
                    time: new Date()
                   
                })
            })
            .then(item => {
                db.collection("groupNotify").doc(groupId).update({
                    total:fireup.FieldValue.increment(1)
                }).then(()=>{
                    setLoading(false)
                    setsingleMessage("")

                })
                
            })
            .catch(err => {
                setLoading(false)
                console.log(err);
                
            })
        }
      
    }

    const insertImage = (e)=>{
        const file = e.target.files[0];
        setLoading(true);
        readAndCompressImage(file,Config).then(resizedImage => {

            var metadata = {
                contentType: file.type
              };
              var rand = (Math.floor(Math.random()*100)).toString()
            var uploadTask = storage.child(`GroupImageMessages/${rand}${file.name}`).put(resizedImage,metadata)


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
                    setLoading(false)

                    

           
                }, function() {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                db.collection("groups").doc(groupId).update({
                    Messages:fireup.FieldValue.arrayUnion({
                        type:"image",
                        sender:Current.email,
                        name:Current.name,
                        content:downloadURL,
                        time: new Date()
                       
                    })
                })
                .then(item => {
                    db.collection("groupNotify").doc(groupId).update({
                        total:fireup.FieldValue.increment(1)
                    }).then(()=>{
    
                      setLoading(false)

    
                    })
                    
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false)
                    
                })


             
               
               

                });
                });
            

        })

    }

    const insertVideo = (e)=>{
        const file = e.target.files[0];
        setLoading(true);
        

            var metadata = {
                contentType: file.type
              };
              var rand = (Math.floor(Math.random()*100)).toString()
            var uploadTask = storage.child(`GroupVideoMessages/${rand}${file.name}`).put(file,metadata)


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
                    setLoading(false)

                    

           
                }, function() {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                db.collection("groups").doc(groupId).update({
                    Messages:fireup.FieldValue.arrayUnion({
                        type:"video",
                        sender:Current.email,
                        name:Current.name,
                        content:downloadURL,
                        time: new Date()
                       
                    })
                })
                .then(item => {
                    db.collection("groupNotify").doc(groupId).update({
                        total:fireup.FieldValue.increment(1)
                    }).then(()=>{
    
                      setLoading(false)

    
                    })
                    
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false)
                    
                })


             
               
               

                });
                });
            

        

    }

   const insertAudio =(blob)=>{
    
    setLoading(true);
    

        var metadata = {
            contentType: blob.type
          };
          var rand = (Math.floor(Math.random()*100)).toString()
        var uploadTask = storage.child(`GroupAudioMessages/$Audio{rand}`).put(blob,metadata)


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
                setLoading(false)

                

       
            }, function() {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            db.collection("groups").doc(groupId).update({
                Messages:fireup.FieldValue.arrayUnion({
                    type:"audio",
                    sender:Current.email,
                    name:Current.name,
                    content:downloadURL,
                    time: new Date()
                   
                })
            })
            .then(item => {
                db.collection("groupNotify").doc(groupId).update({
                    total:fireup.FieldValue.increment(1)
                }).then(()=>{

                  setLoading(false)


                })
                
            })
            .catch(err => {
                console.log(err);
                setLoading(false)
                
            })


         
           
           

            });
            });
        

   }

    const insertDocument = (e)=>{
        const file = e.target.files[0];
        setLoading(true);
        

            var metadata = {
                contentType: file.type
              };
              var rand = (Math.floor(Math.random()*100)).toString()
            var uploadTask = storage.child(`GroupDocumentMessages/${rand}${file.name}`).put(file,metadata)


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
                    setLoading(false)

                    

           
                }, function() {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                db.collection("groups").doc(groupId).update({
                    Messages:fireup.FieldValue.arrayUnion({
                        type:"document",
                        sender:Current.email,
                        name:Current.name,
                        content:downloadURL,
                        documentName:file.name,
                        time: new Date()
                       
                    })
                })
                .then(item => {
                    db.collection("groupNotify").doc(groupId).update({
                        total:fireup.FieldValue.increment(1)
                    }).then(()=>{
    
                      setLoading(false)

    
                    })
                    
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false)
                    
                })


             
               
               

                });
                });
            

        

    }


    


    const AddAsMember = (item)=>{
        
        db.collection("groups").doc(groupId).update({
            members:fireup.FieldValue.arrayUnion({
                name:item.name,
                email:item.email,
                photoUrl:item.photoUrl
            })
        })
        .then(doc => {
            db.collection("users").doc(item.email).update({
                groups:fireup.FieldValue.arrayUnion({
                    name:group.name,
                    icon:group.icon,
                    groupId:groupId,
                    admin:false
                }),
                ["notifyGroup."+groupId]:0

            })
            .then(data => {
                db.collection("groupNotify").doc(groupId).update({
                    members:fireup.FieldValue.arrayUnion(item.email)
                })
                .then(()=>{
                    console.log("added to group successfully");

                })
                
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
        

    }


    const AddMember = ()=>(
        
        group.admin === Current.email ? (
            <div className="row" style={{display: !trigger ? "block" : "none" }}>
            <div className="col-12 text-center mt-2">
                    <button className="btn rounded clock" onClick={()=>{setTrigger(true)}}>Add Member</button>
                    
            </div>
            
        </div>
        ) : ("")
    )

    const putTime = (time)=>{
        return(
            time.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true })
          );
    } 

    const putDate = ()=>{
        const date = new Date()
        return(
            date.toLocaleString('en-US', { day:'numeric',month:'numeric',year:'numeric' })
          );
    } 


    const loadingMessage = ()=>{
      
        
        if(loading === true)
        {
            return(
                <div className="row mt-3">
                    <div className="col-7 offset-5 text-right ">
                            <div className=" mr-3 p-2  rounded" style={{wordWrap:"break-word",display:"inline-block",maxWidth:"100%",backgroundColor:"yellow"}}  >
                            
                                
                                    <p>sending....</p>
                            </div>
                            
                        </div>
                    </div>
            ) 
        }
    }
    const recordingMessage =()=>{

        if(recording === true)
        {
            return(
                <div className="row mt-3">
                    <div className="col-7 offset-5 text-right ">
                            <div className=" mr-3 p-2  rounded bg-success" style={{wordWrap:"break-word",display:"inline-block",maxWidth:"100%"}}  >
                            
                                
                                    <p>Reocording....</p>
                            </div>
                            
                        </div>
                    </div>
            ) 
        }

    }
        
    


    const displayMessage = (type,content,name)=>{
        if(type === "text")
        {
            return(
                  <div>
                 <p className="lead">{content}</p>
                </div> 

            )
        }
        else if(type === "image")
        {
            return(
                
                <a  target="_blank" href={content}>
                <img  src={content} style={{maxHeight:"300px",maxWidth:"300px"}} alt=""/>
                </a>
                
                
            )
        }
        else if(type === "video")
        {
            return(
                <>
                <a  target="_blank" href={content}>
                
                <video width="320" height="240"  src={content} controls>
                
                asdasd
                </video>
                    
           
                </a>
                <i className="fa fa-video-camera" style={{display:"block"}}></i>
                </>
                
            )
        }
        else if(type === "audio")
        {
           return(  
                <audio src={content} controls="controls" />
        )
        }
        else
        {
            return(
                <div className="col-12 text-center">
                <a  target="_blank" href={content}>
                
                <i className="fa fa-file fa-4x text-dark document-icon"></i> 
           
                </a>
                <p>{name}</p>
                </div>
            )
        }

    }

    const deleteMessage =(item) => {
        
        db.collection("groups").doc(groupId).update({
            Messages:fireup.FieldValue.arrayRemove(item)
        }).then(()=>{
            
            
            console.log("deleted successfully")
        })
    }

    const removeFromGroup = async(item)=>{

        let newList = await group.members.filter((member) => member !== item)

        

        db.collection("groups").doc(groupId).update({
            members:newList
        }).then(()=>{
            db.collection("users").doc(item.email).get()
            .then(async (details) =>{
                let groupList = await details.data().groups.filter(data => data.groupId !== groupId )
                    
                
                
                db.collection("users").doc(details.data().email).update({
                    groups:groupList
                })
                .then(()=>{console.log("alll done successfully")})

            })
            .catch(err => console.log(err))

            
        })
        .catch(err => console.log(err))
    }

    


    const mainElement = ()=>{

        var day = ""
        const checkDate =(date)=>{
            
            if(day !== date.getDate())
            {

                if(new Date().getDate() === date.getDate())
                {
                    day = date.getDate()
                    return(
                    
                        <div className="col-12 text-center">
                            <p className="p-1" style={{display:"inline-block",backgroundColor:"#99AAAB",borderRadius:"5px"}}>Today</p>
                        </div>
                    
                )

                }
                day = date.getDate()
                return(
                    
                        <div className="col-12 text-center">
                            <p className="p-1" style={{display:"inline-block",backgroundColor:"#99AAAB",borderRadius:"5px"}}>{date.toLocaleString('en-US', { day:'numeric',month:'long',year:'numeric' })}</p>
                        </div>
                    
                )
            }
            

        }

        return(
        !trigger ? (
            <div className="col-8 ">
            
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-4">
                            <h4 className="lead">Messages:</h4>
                        </div>
                        <div className="col-8">
                            <h4 className="text-right lead">Date:{putDate()}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-12">

                <div id="qw" className="fix mr-auto ml-auto text-dark">
                    
                  {group.Messages.map((item,index) => {
                      

                    
                      return(
                        
                    item.sender === Current.email ? 
                    (  
                        
                        <div key={index} className="row mt-3">
                        {checkDate(item.time.toDate())}
                        <div className="col-7 offset-5 text-right ">
                            <div className=" mr-3 p-2  rounded" style={{wordWrap:"break-word",display:"inline-block",maxWidth:"100%",backgroundColor:"#EEAEEE"}}
                             onMouseOver={()=>{
                            document.getElementById(index).style.display="block"
                    }} onMouseOut={()=>{document.getElementById(index).style.display="none"}}   >
                                <div>
                                    {displayMessage(item.type,item.content,item.documentName)}
                                </div>
                                <div  > 
                                <p className="text-left ml-1"  style={{fontSize:"8px",color:"black"}}>
                                {putTime(item.time.toDate())}
                                </p>
                                <div className="row" style={{display:"none"}} id={index}>
                                    <div className="col-12 text-right">
                                        <i onClick={()=>{deleteMessage(item)}} className="fa fa-trash small-icons"></i>
                                    </div>
                                </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>) 
                    :  (<div key={index} className="row mt-3">
                    {checkDate(item.time.toDate())}
                        <div className="col-7 ">
                            <div className="lead ml-3 rounded" style={{wordWrap:"break-word",maxWidth:"100%",display:"inline-block",backgroundColor:"#DAE0E2"}} >
                                <div className="row" style={{fontSize:"13px",marginLeft:"5px"}}>{item.name}</div>
                                <div className="p-3 ">
                                {displayMessage(item.type,item.content,item.documentName)}


                                </div>
                                <div className="mr-1" > 
                                <p className="text-right" style={{fontSize:"8px",color:"black"}}>
                                {putTime(item.time.toDate())}
                                </p></div>
                            </div>
                        </div>
                    </div>)

)})}
{loadingMessage()}
{recordingMessage()}
<Emoji emoji={emoji} singleMessage={singleMessage} setsingleMessage={setsingleMessage} ></Emoji>
<div className="clear"></div>


                </div>
                <InputBox insertMessage={insertMessage} insertImage={insertImage} insertVideo={insertVideo} 
                insertDocument = {insertDocument} setRecording ={setRecording} emoji={emoji} setEmoji={setEmoji}
                singleMessage={singleMessage} setsingleMessage={setsingleMessage} insertAudio = {insertAudio}
                ></InputBox>

                </div>
            </div>
           
            
        </div>
          ):(
              <div className="col-7 ml-3 mt-3" id="qw">
              
              <ul className="list-group fix" style={{maxHeight:"80vh"}} >
                    {Current.friends.map(item =>{
                        return(
                            !Members.includes(item.email) ? (
                                <li key={item.email} className="list-group-item friend" style={{color:"black"}}>
                                <div className="row">
                                    <div className="col-2" style={{  
        backgroundImage: "url(" + item.photoUrl+ ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
        }}>
                                         
                                    </div>
                                    <div className="col-7 ">
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
                                            <button onClick={()=>{
                                                AddAsMember(item)
                                            }} className="btn btn2">Add</button>
                                    </div>
                                </div>
                            </li>
                            ) : ("")
                        )
                    })}

                    </ul>
                    <div className="text-center">
                    <button onClick={()=>{setTrigger(false)}} className="btn btn-lg rounded mt-3">back</button>

                    </div>
              
                   
              </div>
             
          )
    ) }




    const chatBox = ()=> {
        return(
            <div className="row">
        <div className="col-4">
            <div className="row">
            <div className="col-12 mt-3 text-center"  >
            <img className="groupIcon"  src={group.icon} alt=""/>
                
            </div>
            </div>
            <div className="row">
                <div className="col-12 text-center mt-2">
                        <h4  style={{color:"black"}}>{group.name}</h4>
                </div>
                
            </div>
            {AddMember()}

            <ul className="list-group fix mt-3" style={{maxHeight:"50vh"}}>
            <div className="bg-white p-2">
               
            <p className="text-dark lead">Group Participants</p>
            </div>
                        { group.members.map(item => (
                            <li key={item.email} onMouseOver={()=>{
                                if(Current.email === group.admin )
                                    {
                                        document.getElementById(item.email).style.display="block"
                                    }
                            }} onMouseOut={()=>{
                                    if(Current.email === group.admin)
                                    {
                                        document.getElementById(item.email).style.display="none"
                                    }
                                
                            }} className="list-group-item friend" style={{color:"black"}}>
                                <div className="row">
                                    <div className="col-2" style={{  
        backgroundImage: "url(" + item.photoUrl+ ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
        }}>
                                         
                                    </div>
                                    <div className="col-7 " >
                                         <div className="row select">
                                             <div className="col">
                                                 <p className="lead">{item.name}</p>
                                             </div>
                                         </div>
                                         
                                    </div>
                                    
                                </div>
                                {Current.email === group.admin ? (
                                    <div id={item.email} style={{display:"none"}} className="col-12 text-center">
                                    <button onClick={()=>{removeFromGroup(item)}} className=" btn  btn2 rounded">Remove from Group</button>
                                </div>
                                ):("")}
                            </li>
                        ))}
                    </ul>

           
        </div>
            {mainElement()}
        

        </div>
           
        )
    }





    return (
        <Base  >
                {chatBox()}
               
        
        </Base>
    )
}

export default GroupChat
