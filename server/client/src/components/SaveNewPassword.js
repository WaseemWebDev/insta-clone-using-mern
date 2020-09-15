import React,{useState} from "react";
import M from 'materialize-css';
import {useHistory,useParams} from 'react-router-dom';

export default function SaveNewPassword() {
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const {token} =  useParams();
  const  history = useHistory();
  const submit = ()=>{
    fetch('/savepassword', {
      method: 'POST',
      body: JSON.stringify({
       password,
       token
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      }
    })
    .then(response => response.json())
    .then((data) =>{
      console.log(data)
      if(data.error){
        setError(data.error)
    } 
    else{

      M.toast({html: 'password has been Reset successfully ', classes: '#66bb6a green lighten-1'})
      setPassword("")
      history.push('/login')
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
                  <h3>Set New Password</h3>
                </span>
              </center>
              
              <div className="input-field "> 
              <input id="email" name="email" placeholder="Enter Email" type="text" value={password} onChange={(e)=>setPassword(e.target.value)} className="validate" />
            </div>
          
                <button
                  className="btn waves-effect waves-light"
                 onClick={submit}
                >

                  Update Password
                  <i className="material-icons right">send</i>
                </button>
                <h4 style={{color:"red"}}>{error?error:""}</h4>
            
            </div>
          </div>
        </div>
    </div>
  );
}
