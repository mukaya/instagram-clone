import React, {useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from "../App"

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  const renderList = () => {
    if(state){
      return [
        <li><Link to="/profile">Profil</Link></li>,
        <li><Link to="/create">Crée un post</Link></li>,
        <li><Link to="/myfollowingpost">les posts des mes amis</Link></li>,
        <li>
           <button onClick={()=>{
             localStorage.clear()
             dispatch({type:"CLEAR"})
             history.push("/signin")
           }} className="btn red daken-3">
              Déconnection
           </button>
        </li>
      ]
    }else{
      return [
        <li><Link to="/signin">Connection</Link></li>,
        <li><Link to="/signup">Inscription</Link></li>
      ]
    }
  }
    return (
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/signin"} className="brand-logo">Osee-sociaux</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}

export default NavBar
