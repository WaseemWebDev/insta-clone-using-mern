import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { globalContext } from '../GlobalProvider/state';
export default function Navbar() {
  const { user, clearUser } = useContext(globalContext);
  
  // console.log(user)
  const logout = () => {
    clearUser()
    localStorage.removeItem("jwt")
    localStorage.removeItem("user")
   
  }
  function changeLinks() {
    if (user) {
      return (
        <div>
       
        <li><Link to="/" > <i className="material-icons">home</i></Link></li>
        <li><Link to="/Profile"><i className="material-icons">account_circle</i></Link></li>
        <li><Link to="/createpost"><i className="material-icons">cloud_upload</i></Link></li>
        <li><Link to="/myfollowing">My Following</Link></li>
        <li onClick={logout}><Link to="/login">Logout</Link></li>
       
      </div>
      
      )
    }
    else {
      return (
      <div>
        <li><Link to="/login">login</Link></li>
        <li><Link to="/signup">sign up</Link></li>
      </div>
      )
    }
  }
  return (
    <div>
      <nav>
        <div className="nav-wrapper" style={{ background: "white" }}>
          <Link to={user?"/":"/login"} className="brand-logo left">Insta</Link>
          <ul id="nav-mobile" className="right">
         {changeLinks()}
          </ul>
        </div>
      </nav>


    </div>
  )
}
