import React, {useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from "../App"

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  const renderList = () => {
    if(state){
      return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create</Link></li>,
        <li><Link to="/myfollowingpost">my following posts</Link></li>,
        <li>
           <button onClick={()=>{
             localStorage.clear()
             dispatch({type:"CLEAR"})
             history.push("/signin")
           }} className="btn red daken-3">
              logaout
           </button>
        </li>
      ]
    }else{
      return [
        <li><Link to="/signin">Login</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]
    }
  }
    return (
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/signin"} className="brand-logo">Instragram</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}

export default NavBar
