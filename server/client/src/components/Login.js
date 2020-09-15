import React,{useState,useContext} from "react";
import M from 'materialize-css';
import {useHistory, Link} from 'react-router-dom';
import {globalContext} from '../GlobalProvider/state';

  
export default function Login() {
  const { addUser } = useContext(globalContext);
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [error,setError] = useState("");
  const  history = useHistory();
  const submit = ()=>{
    fetch('/signin', {
      method: 'POST',
      body: JSON.stringify({
       email,
       password
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      }
    })
    .then(response => response.json())
    .then((data) =>{
      if(data.error){
        setError(data.error)
    } 
    else{
      
     localStorage.setItem("jwt",data.token)
     localStorage.setItem("user",JSON.stringify(data.user))
     addUser(data.token)
      M.toast({html: 'successfully logged in', classes: '#66bb6a green lighten-1'})
      setPassword("")
      setEmail("")
      history.push('/')

    }
    })
    
  }
  return (
    
    
      <div className="row" id="loginform">
        <div className="col s12 m6 offset-m3 ">
          <div className="card white">
            <div className="card-content ">
              <center>
                <span className="card-title">
                  <h3>Login</h3>
                </span>
              </center>
              
              <div className="input-field "> 
              <input id="email" name="email" placeholder="Enter Email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} className="validate" />
              
            </div>
            <div className="input-field ">
              <input id="Password" placeholder="Enter Password" name="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="validate" />
             
            </div>
                <button
                  className="btn waves-effect waves-light"
                 onClick={submit}
                >

                  Login
                  <i className="material-icons right">send</i>
                </button>
                <h4 style={{color:"red"}}>{error?error:""}</h4>

                <h5>Forgot Password?  <Link to="/resetpassword"><b style={{color:"green"}}>Click here</b></Link></h5>
            
            </div>
          </div>
        </div>
    </div>
  );
}
