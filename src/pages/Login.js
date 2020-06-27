import React,{useState} from 'react'
import Base from "../components/Base"
import {Link} from "react-router-dom"
import {auth,db} from "../firebase/Fire.js"

function Login() {

const [email, setemail] = useState("vicky@gmail.com")
const [password, setpassword] = useState("123456789")
const [err,seterr] = useState("")

const formSubmit = (e)=>{
    e.preventDefault();
    auth().signInWithEmailAndPassword(email,password)
    .then((user) => {
        //
    })
    .catch(err => {
        seterr(err.message)
        console.log(err)
    })

}


    const LoginForm =()=>{
        
        return(
            <div className="row mt-3">
             
                <div className="col-md-6 offset-3">
                
                
                <form className="form text-white">
                    
                    <div className="form-group">
                        <label style={{color:"black"}}>Email</label>
                        <input type="text" className="form-control" required  onChange={(e)=>{setemail(e.target.value)}} value={email} />
                    </div>
                    
                    <div className="form-group">
                        <label style={{color:"black"}}>Password</label>
                        <input type="password" className="form-control" required  onChange={(e)=>{setpassword(e.target.value)}} value={password} />
                    </div>
                    

                    <div className="form-group mt-4">
                        <button type="submit" onClick={formSubmit}  className="btn  rounded text-white btn-block" >Login</button>
                    </div>
                </form>
                <div className="text-center text-white">
                    <p style={{color:"black"}}>New User? Then <Link to="/signup" className="text-info">Signup</Link> here</p>
                </div>

                </div>
            </div>
        )
    }

    
    return (
        <Base name="Login Page">
            {LoginForm()}
        </Base>
    )
}

export default Login
