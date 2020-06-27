import React from 'react'

function Card({name,email,photoUrl}) {
    return (
        <div className="card  text-white " style={{backgroundImage:"url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)"}}>
    
        <img src={photoUrl} className="card-img-top rounded ml-auto mr-auto mt-3 profileDp" style={{maxHeight:"300px",maxWidth:"300px"}} alt=""/>

        <div className="card-body mt-3   text-center">
            
            
            <h3 className="card-title text-dark border-black border-bottom pb-2">
              {name}
            </h3>
            <p className="card-text text-dark"> {email}</p>
        </div>
            
        </div>
    )
}

export default Card
