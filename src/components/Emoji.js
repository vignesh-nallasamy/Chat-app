import React, { useState } from 'react';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
 
const Emoji = ({emoji,setsingleMessage,singleMessage}) => {
  const [chosenEmoji, setChosenEmoji] = useState(null);
 
  const onEmojiClick = async(event, emojiObject) => {
    setChosenEmoji(emojiObject);
    console.log(emojiObject);
    await setsingleMessage((prevState)=>(prevState+emojiObject.emoji))
    console.log(singleMessage);
    
    
  };
 if(emoji)
 {
    return (
     <div className="row mt-3">
                    <div className="col-7 offset-5 text-right ">
                            <div className=" mr-3 p-2  " style={{wordWrap:"break-word",display:"inline-block",maxWidth:"100%"}}  >
                            
                            <Picker onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_DARK} />
                                 
                            </div>
                            
                        </div>
                    </div>
       
      );
 }
 else{
     return("")
 }
  
};

export default Emoji