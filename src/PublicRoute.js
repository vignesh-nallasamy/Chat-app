import React,{useContext} from "react"
import {Redirect,Route} from "react-router-dom"
import {MyContext}  from  "./Context"


function PublicRoute({ component: Component, ...rest }) {
  const {authenticated} = useContext(MyContext)

    return (
      <Route
        {...rest}
        render={(props) => authenticated === false
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
      />
    )
  }

  export default PublicRoute