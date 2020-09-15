import React, { useState } from "react";
import M from 'materialize-css';
import axios from 'axios';

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState('');
  const [loading,setLoading] = useState(null)

  const onChange = e => {
    setFile(e.target.files[0]);
  };
  const postDetails = ()=>{
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
    .then(data=>{
      if(data.url !==""){
        axios
        .post("/createpost", {title,body, photo:data.url}, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((result) => {
          setLoading(false)
          setTitle("")
          setBody("")
          M.toast({html:'created post successfully ', classes: '#66bb6a green lighten-1'})
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
  <div className="row" id="loginform">
    <div className="col s12 m6 offset-m3 ">
      <div className="card white">
        <div className="card-content ">
          <center>
            <span className="card-title">
              <h3>Create Post</h3>
            </span>
          </center>
          
            <div className="input-field ">
              <input id="title" placeholder="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="validate" />
            
            </div>
            <div className="input-field ">
              <input id="body" type="text" placeholder="body" className="validate" value={body} onChange={(e) => setBody(e.target.value)} />
              
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
             {loading ? "creating..." : "Create"} 
                <i className="material-icons right">send</i>
            </button>
          

        </div>
      </div>
    </div>
  </div>
);
}
