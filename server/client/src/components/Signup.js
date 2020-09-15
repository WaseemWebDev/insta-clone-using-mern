import React,{useState} from 'react'
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import axios from 'axios';

export default function Signup() {

  const [name,setName] = useState("");
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const [file, setFile] = useState('');
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(null);
  const  history = useHistory();
  const onChange = e => {
    setFile(e.target.files[0]);
  };

   
    const postDetails = (e)=>{
      e.preventDefault()
      
      setLoading(true)
      const data = new FormData()
      data.append("file",file)
      data.append("upload_preset","instaclone")
      data.append("cloud_name","ddfygzgrw")
      fetch("https://api.cloudinary.com/v1_1/ddfygzgrw/image/upload",{
          method:"post",
          body:data
      })
      .then(res=>res.json())
      .then(dataGet=>{
        if(dataGet.url !==""){
          axios
          .post("/signup", {name,email, password,photo:dataGet.url}, {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          })
          .then((result) => {
            console.log(result.data)
            if(result.data.error){
              setError(result.data.error)
              setLoading(false)
            }
            else{
              M.toast({html:'signed up post successfully ', classes: '#66bb6a green lighten-1'})
              history.push("/login")
            }
          })
          .catch((err) => {
            setLoading(false)
            console.log(err.message);
          });
        }
      })
      .catch(err=>{
        setLoading(false)
          console.log(err)
      })
    }
  
   
    return (
        <div>
        <div className="row" id="loginform">
        <div className="col s12 m6 offset-m3 ">
          <div className="card white">
        
            <div className="card-content ">
              <center>
                <span className="card-title">
                  <h3>Signup</h3>
                </span>
              </center>
             <form onSubmit={postDetails}>
              <div className="input-field ">
              <input id="name" placeholder="Enter Name" type="text" name="name" value={name} onChange={(e)=>setName(e.target.value)} className="validate" />
            
            </div>
                <div className="input-field "> 
                  <input id="email" name="email" placeholder="Enter Email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} className="validate" />
                  
                </div>
                <div className="input-field ">
                  <input id="Password" placeholder="Enter Password"name="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="validate" />
                 
                </div>
                <div className="file-field input-field">
              <div className="btn">
                <span>Image</span>
                <input type="file" onChange={onChange} />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
                <button
                  className="btn waves-effect waves-light"
                  
                  onClick={postDetails}
                >
                 {loading ? "Loading....":"Signup"} 
                  
                  <i className="material-icons right">send</i>
                </button>
                </form>
                <h4 style={{color:"red"}}>{error?error:""}</h4>
              <h6 style={{color:"green"}}>Already have an account? <Link to="/login">click here</Link> </h6>
            </div>
          </div>
        </div>
    </div>
        </div>
    )
}
