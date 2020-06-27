import React,{useState,useEffect} from 'react'
import Base from "../components/Base"
import InputBox from "../components/InputBox"
import {auth,db,fireup,storage} from "../firebase/Fire"
import {useParams,useHistory} from "react-router-dom"
import  {readAndCompressImage} from "browser-image-resizer"
import Config from "../apiCalls/Config"
import MicRecorder from 'mic-recorder-to-mp3';
import Emoji from "../components/Emoji"


function Chat() {

    const Mp3Recorder = new MicRecorder({ bitRate: 128 });

   
    
    let history = useHistory()
    const {friendemail,chatId} = useParams()
    const [loading,setLoading] = useState(false)
    const [recording,setRecording] = useState(false)
    const [emoji,setEmoji] = useState(false)
    const [Current , setCurrent] = useState({
        name : "",
        email : "",
        photoUrl : "",
        friends:""
        
    })
    const [Friend , setFriend] = useState({
        name : "",
        email : "",
        photoUrl : "",
        online:"",
        
    })
    const [singleMessage, setsingleMessage] = useState("")

    const [messages,setMessages] = useState([]);


    const preload = async()=>{

        const current = await auth().currentUser
       
    
        db.collection("users").doc(current.email).get()
        .then(item => {
            if(item.exists)
            {
    
                setCurrent({
                    ...Current,name:item.data().name,email:item.data().email,photoUrl:item.data().photoUrl,friends:item.data().friends
                })
                db.collection("users").doc(friendemail).get()
                .then(item => {
                    if(item.exists)
                    {
                        setFriend({
                            ...Friend,name:item.data().name,email:item.data().email,photoUrl:item.data().photoUrl,online:item.data().online
                        }) 
                    }
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
        
    },[friendemail])

    useEffect(()=>{
        db.collection("users").doc(friendemail)
        .onSnapshot(function(item) {
           
            
            setFriend({
                ...Friend,name:item.data().name,email:item.data().email,photoUrl:item.data().photoUrl,online:item.data().online
            }) 
        });
    },[])

    useEffect(()=>{
        updateScroll()
    },[messages])

    useEffect(()=>{
        db.collection("chats").doc(chatId).get()
        .then(doc => {
            setMessages(doc.data().Messages)
           if(Current.email)
           {
            var data1 =chatId.replace(".","q");
            var data2 = data1.replace(".","q")
            db.collection("users").doc(Current.email).update({
                ["notify."+data2]:0
            }).then()
           }
        }).catch(err => console.log(err))
    },[Current])

    useEffect(()=>{
        db.collection("chats").doc(chatId)
        .onSnapshot(function(doc) {
            setMessages(doc.data().Messages)
            if(Current.email)
            {
                var data1 =chatId.replace(".","q");
            var data2 = data1.replace(".","q")
            db.collection("users").doc(Current.email).update({
                ["notify."+data2]:0
            }).then(()=> console.log("success"))
            }
        });
    },[])

   const blockUser= async()=>{

    let newList = await Current.friends.map((item)=>{
        if(item.email === friendemail)
        {
            item.blocked = true
        }
        return(item)
    })

    db.collection("users").doc(Current.email).update({
        friends:newList
    })
    .then(()=>{
        alert("blocked");
        setTimeout(()=>{
            history.push("/")
        },1000)
        
    })
    
    

   }

   const insertMessage = (e)=>{
        e.preventDefault();

        if(singleMessage)
        {
            db.collection("chats").doc(chatId).update({
                Messages:fireup.FieldValue.arrayUnion({
                    type:"text",
                    sender:Current.email,
                    receiver:Friend.email,
                    content:singleMessage,
                    time: new Date()
                   
                })
            })
            .then(item => {

                  var firstVal = chatId.replace(".","q")
                  var lastVal = firstVal.replace(".","q")
                db.collection("users").doc(Friend.email).update({
                    ["notify."+lastVal] : fireup.FieldValue.increment(1)
                }).then(item =>{
                    setsingleMessage("")
                }).catch(err => console.log(err)
                )
            })
            .catch(err => {
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
            var uploadTask = storage.child(`imageMessages/${rand}${file.name}`).put(resizedImage,metadata)


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
                db.collection("chats").doc(chatId).update({
                    Messages:fireup.FieldValue.arrayUnion({
                        type:"image",
                        sender:Current.email,
                        receiver:Friend.email,
                        content:downloadURL,
                        time: new Date()
                       
                    })
                })
                .then(item => {
    
                      var firstVal = chatId.replace(".","q")
                      var lastVal = firstVal.replace(".","q")
                    db.collection("users").doc(Friend.email).update({
                        ["notify."+lastVal] : fireup.FieldValue.increment(1)
                    }).then(item =>{
                        console.log("successsss")
                        setLoading(false)
                    }).catch(err => {console.log(err)
                        setLoading(false)
                    }
                    )
                    
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
        var uploadTask = storage.child(`videoMessages/${rand}${file.name}`).put(file,metadata)


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
            db.collection("chats").doc(chatId).update({
                Messages:fireup.FieldValue.arrayUnion({
                    type:"video",
                    sender:Current.email,
                    receiver:Friend.email,
                    content:downloadURL,
                    time: new Date()
                   
                })
            })
            .then(item => {

                  var firstVal = chatId.replace(".","q")
                  var lastVal = firstVal.replace(".","q")
                db.collection("users").doc(Friend.email).update({
                    ["notify."+lastVal] : fireup.FieldValue.increment(1)
                }).then(item =>{
                    
                    setLoading(false)
                }).catch(err => {console.log(err)
                    setLoading(false)
                }
                )
                
            })
            .catch(err => {
                
                setLoading(false)
                
            })

            });
            });
    }

    const insertAudio = (blob)=>{

        setLoading(true);
        var metadata = {
            contentType: blob.type
          };
          var rand = (Math.floor(Math.random()*100)).toString()
        var uploadTask = storage.child(`AudioMessages/Audio ${rand}`).put(blob,metadata)


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
            db.collection("chats").doc(chatId).update({
                Messages:fireup.FieldValue.arrayUnion({
                    type:"audio",
                    sender:Current.email,
                    receiver:Friend.email,
                    content:downloadURL,
                    time: new Date()
                   
                })
            })
            .then(item => {

                  var firstVal = chatId.replace(".","q")
                  var lastVal = firstVal.replace(".","q")
                db.collection("users").doc(Friend.email).update({
                    ["notify."+lastVal] : fireup.FieldValue.increment(1)
                }).then(item =>{
                    console.log("successsss")
                    setLoading(false)
                }).catch(err => {console.log(err)
                    setLoading(false)
                }
                )
                
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
        var uploadTask = storage.child(`documentMessages/${rand}${file.name}`).put(file,metadata)


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
            db.collection("chats").doc(chatId).update({
                Messages:fireup.FieldValue.arrayUnion({
                    type:"document",
                    sender:Current.email,
                    receiver:Friend.email,
                    content:downloadURL,
                    documentName:file.name,
                    time: new Date()
                   
                })
            })
            .then(item => {

                  var firstVal = chatId.replace(".","q")
                  var lastVal = firstVal.replace(".","q")
                db.collection("users").doc(Friend.email).update({
                    ["notify."+lastVal] : fireup.FieldValue.increment(1)
                }).then(item =>{
                    console.log("successsss")
                    setLoading(false)
                }).catch(err => {console.log(err)
                    setLoading(false)
                }
                )
                
            })
            .catch(err => {
                console.log(err);
                setLoading(false)
                
            })


         
           
           

            });
            });
    } 

    const loadingMessage = ()=>{
       
        
        if(loading === true)
        {
            return(
                <div className="row mt-3">
                    <div className="col-7 offset-5 text-right ">
                            <div className=" mr-3 p-2  rounded bg-warning" style={{wordWrap:"break-word",display:"inline-block",maxWidth:"100%"}}  >
                            
                                
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


    const deleteMessage =(item) => {
        console.log(item);
        db.collection("chats").doc(chatId).update({
            Messages:fireup.FieldValue.arrayRemove(item)
        }).then(()=>{
            
            
            console.log("deleted successfully")
        })
    }
        
    const onlineMessage =()=>{
        if(Friend.online)
        {
            return(
                <p className="badge badge-success p-1">Online</p>
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
                <div className="col-8 ">
                
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-4">
                                <h4 className="lead" style={{color:"black"}}>Messages:</h4>
                            </div>
                            <div className="col-8">
                            <h4 className="text-right lead" style={{color:"black"}}>Date:{putDate()}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
    
                    <div id="qw" className="fix mr-auto ml-auto text-dark" >
                      {messages.map((item,index) => (
    
                        item.sender === Current.email ? 
                        (<div key={index} className="row mt-3">
                        {checkDate(item.time.toDate())}
                        <div className="col-7 offset-5 text-right " >
                                <div className=" mr-3 p-2  rounded" style={{wordWrap:"break-word",display:"inline-block",maxWidth:"100%",backgroundColor:"#EEAEEE"}}  onMouseOver={()=>{
                                document.getElementById(index).style.display="block"
                        }} onMouseOut={()=>{document.getElementById(index).style.display="none"}}  >
                                  
                                    {displayMessage(item.type,item.content,item.documentName)}
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
                                <div className="lead ml-3 rounded" style={{wordWrap:"break-word",maxWidth:"100%",display:"inline-block",backgroundColor:"white"}} >
    
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
    
    ))}
    {recordingMessage()}
    {loadingMessage()}
    <Emoji emoji={emoji} singleMessage={singleMessage} setsingleMessage={setsingleMessage} ></Emoji>

    <div className="clear"></div>
    
                    </div>
                    <InputBox insertMessage={insertMessage} insertImage={insertImage} insertVideo={insertVideo} 
                    insertDocument = {insertDocument} emoji={emoji} setEmoji={setEmoji}
                    singleMessage={singleMessage} setsingleMessage={setsingleMessage} insertAudio={insertAudio} setRecording={setRecording}
                    ></InputBox>
    
                    </div>
                </div>
               
                
            </div>
    
            )
        
        
        
    }
    
     
    


    const chatBox = ()=> {
        return(
            <div className="row">
        <div className="col-3">
            <div className="row">
            <div className="col-12 mt-5 text-center"  >
            <img className=" profileDp"  src={Friend.photoUrl} alt=""/>
                
            </div>
            </div>
            <div className="row">
                <div className="col-12 text-center mt-5">
                        <h4 style={{color:"black"}}>{Friend.name}</h4>
                </div>
                <div className="col-12 text-center mt-3">
                        <h6 style={{color:"black"}}>{Friend.email}</h6>
                </div>
                <div className="col-12 text-center mt-3">
                        {onlineMessage()}
                </div>
                <div className="col-12 text-center mt-3">
                        <button className="btn  rounded" onClick={blockUser}>Block</button>
                </div>
              
            </div>
        </div>
        {mainElement()}
        

        </div>
           
        )
    }





    return (
        <Base >
                {chatBox()}
               
        
        </Base>
    )
}

export default Chat
