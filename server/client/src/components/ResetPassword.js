import React,{useState} from "react";
import M from 'materialize-css';
import {useHistory} from 'react-router-dom';

export default function ResetPassword() {
  const [email,setEmail] = useState("");
  const [error,setError] = useState("");
  const  history = useHistory();
  const submit = ()=>{
    fetch('/resetpassword', {
      method: 'POST',
      body: JSON.stringify({
       email,
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
      M.toast({html: 'Email sent Successfully', classes: '#66bb6a green lighten-1'})
      setEmail("")
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
                  <h3>Reset Password</h3>
                </span>
              </center>
              
              <div className="input-field "> 
              <input id="email" name="email" placeholder="Enter Email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} className="validate" />
            </div>
          
                <button
                  className="btn waves-effect waves-light"
                 onClick={submit}
                >

                  Reset Password
                  <i className="material-icons right">send</i>
                </button>
                <h4 style={{color:"red"}}>{error?error:""}</h4>
            
            </div>
          </div>
        </div>
    </div>
  );
}
