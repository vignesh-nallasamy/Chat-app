import React from 'react'
import Base from "../components/Base"
import { signout } from '../apiCalls/AuthFire'
import {Link} from 'react-router-dom' 

function Signout() {
    return (
        <Base>
            <div className="row ">
                <div className="col-4 offset-4 mt-auto mb-auto">
                    <div className="row">
                        <div className="col-12 " style={{backgroundColor:"#431c5d"}}>
                            <p className="lead">Are u Sure?</p>
                        </div>
                    </div>
                    <div className="row bg-white p-5">
                        <div className="col-6 text-center">
                                <button onClick={signout} className="btn rounded mt-auto mb-auto">Signout</button>
                        </div>
                        <div className="col-6 text-center">
                        <Link className="btn btn2 rounded mt-auto mb-auto" to="/">Cancel</Link>
                            
                        </div>
                    </div>

                </div>
            </div>
        </Base>
    )
}

export default Signout
