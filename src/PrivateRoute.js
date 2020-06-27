import React,{useContext} from "react"
import {Redirect,Route} from "react-router-dom"
import {MyContext}  from  "./Context"


function PrivateRoute({ component: Component, ...rest }) {
  const {authenticated} = useContext(MyContext)

    return (
      <Route
        {...rest}
        render={(props) => authenticated === true
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
      />
    )
  }

  export default PrivateRoute