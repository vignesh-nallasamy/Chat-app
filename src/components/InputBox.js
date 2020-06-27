import React from 'react'
import Audio from "./Audio"


function InputBox({insertMessage,insertImage,insertVideo,insertDocument,singleMessage,setsingleMessage,insertAudio,setRecording,emoji,setEmoji}) {
    return (

        <div id="inputs" className="text-dark">
                    <div className="row">
                        <div className="col-5 border-right">
                        <div className="row">
                            <div className="ml-1 col-2 text-center">
                            <div className="image-upload mt-4">
                            
                            <label htmlFor="image-input">
                                <i className="fa fa-camera fa-2x icon" style={{color:" #8458B3"}}></i>
                            </label>

                            <input id="image-input" type="file" accept="image/*" onChange={insertImage} />
                            </div>
                            </div>
                            
                            
                            <div className="col-2 text-center">
                            <div className="image-upload mt-4">
                            <label htmlFor="video-input">
                                <i className="fa fa-file-video-o fa-2x  icon " style={{color:" #8458B3"}}></i>
                            </label>

                            <input id="video-input" type="file" accept="video/*" onChange={insertVideo} />
                            </div>
                            </div>

                            <div className="col-2 text-center">
                            <div className="image-upload  mt-4 pointer">
                            <label htmlFor="document-input"  >
                                <i className="fa fa-book fa-2x  icon" style={{color:" #8458B3"}}></i>
                            </label>

                            <input id="document-input" type="file" accept=".xlsx,.xls,,.doc, .docx,.ppt, .pptx,.txt,.pdf" onChange={insertDocument}/>
                            </div>
                            </div>
                            <Audio insertAudio={insertAudio}  setRecording={setRecording}></Audio>
                            <div className="col-2" >
                                
                                    <button   style={{display: emoji? "none":"block"}} className="btn btn-dark round text-center mt-3" onClick={()=>{setEmoji(true)}}  ><i className="fa fa-smile-o fa-2x"></i></button>
                                    <button style={{display: emoji? "block":"none"}} className="btn btn2 btn-danger round text-center mt-3" onClick={()=>{setEmoji(false)}} ><i className="fa fa-smile-o fa-2x"></i> </button>
                                
                                </div>

                            
                            
                        </div>
                        </div>
                        <div className="col-7">
                           <form onSubmit={insertMessage} >
                           <div className="row mt-4">
                               <div className="col-10">
                               <div className="form-group">
                                    <textarea name="" id="" cols="20" rows="1" className="form-control" value={singleMessage} onChange = {(e)=>{setsingleMessage(e.target.value)}}></textarea>
                                </div>
                               </div>
                               <div className="col-2">
                                        <button type="submit" onClick={(e)=>{insertMessage(e);setEmoji(false)}}  className="btn send btn-lg text-center" > <i className="fa fa-paper-plane" ></i></button>
                               </div>
                           </div>
                           </form> 
                        </div>
                    </div>
                </div>
    )
}

export default InputBox
