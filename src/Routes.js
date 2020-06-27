import React,{useState,useEffect} from 'react'
import {BrowserRouter as Router,Route,Switch} from "react-router-dom"
import {auth} from "./firebase/Fire"
import {MyContext} from "./Context"
import {useHistory} from "react-router-dom"
import {db} from "./firebase/Fire"
//Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Signout from "./pages/Signout"
import Chat from "./pages/Chat"
import AddFriend from "./pages/AddFriend"
import AddGroup from "./pages/AddGroup"
import FriendList from "./pages/FriendList"
import GroupList from "./pages/GroupList"
import GroupChat from "./pages/GroupChat"
import BlockList from "./pages/BlockList"

//private routes
import PrivateRoute from "./PrivateRoute"
import PublicRoute from "./PublicRoute"

function Routes() {
    var history = useHistory() 
    const [authenticated, setAuthenticated] = useState(false)
    const [userId, setUserId] = useState()

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            if(user)
            { 
                db.collection("users").doc(auth().currentUser.email).update({
                    online:true
                 }
                 ).then(()=>{
                     console.log("logged In");
                     
                 })
                setAuthenticated(true)
                setUserId(user.uid)
            }
            else
            {
               
                
                setAuthenticated(false)
            }
        })
    }, [])


    const Routings =()=>(

        <Router>
                <Switch>
                <MyContext.Provider value={{authenticated,userId}}>
                    <PrivateRoute path="/" exact component={Home} ></PrivateRoute>
                    <PrivateRoute path="/chat/:friendemail/:chatId" exact component={Chat}></PrivateRoute>
                    <PrivateRoute path="/addfriend" exact  component={AddFriend} ></PrivateRoute>
                    <PrivateRoute path="/signout" exact  component={Signout} ></PrivateRoute>
                    <PrivateRoute path="/addgroup" exact  component={AddGroup} ></PrivateRoute>
                    <PrivateRoute path="/friendlist" exact component={FriendList}></PrivateRoute>
                    <PrivateRoute path="/grouplist" exact component={GroupList}></PrivateRoute>
                    <PrivateRoute path="/group/:groupId" exact component={GroupChat}></PrivateRoute>
                    <PrivateRoute path="/blocklist" exact component={BlockList}></PrivateRoute>
                    <PublicRoute path="/login"   exact component={Login} ></PublicRoute>
                    <PublicRoute path="/signup" exact  component={Signup} ></PublicRoute>


                </MyContext.Provider>

                </Switch>
        </Router>

    )

    return (
        <Routings></Routings>
    )
}

export default Routes
