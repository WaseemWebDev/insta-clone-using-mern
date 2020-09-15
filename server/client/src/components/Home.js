import React, { useEffect, useState } from "react";
import axios from "axios";
import M from 'materialize-css';
import {Link} from 'react-router-dom';
import Footer from "./footer";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  let [count, setCount] = useState(0);
  let [comment, setComment] = useState("");
  let [search, setSearch] = useState("");
  let [searchResults, setSearchResults] = useState("");


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      setUserId(user._id)
    }
    
    function getposts() {
      axios
        .get("/allposts", {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => {
          setPosts(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    getposts();
  }, [count]);

  const likePost = (postId) => {
    axios
      .post("/likes", { postId }, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((result) => {
setCount(count+=1)

      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const unlikePost = (postId) => {
    axios
      .post("/unlikes", { postId }, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((result) => {
        setCount(count-=1)
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const sendComment = (postId)=>{
    if(comment === ""){
      alert("please write a comment");
    }
    else{
      axios
    .post("/comment", { postId, comment}, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
    .then((result) => {
      setComment("")
      setCount(count+=1)
    })
    .catch((err) => {
      console.log(err.message);
    });
  }
    }

    const deletePost = (postId)=>{
        axios
      .post("/deletepost",{ postId}, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((result) => {
        M.toast({html: result.data.message, classes: '#66bb6a green lighten-1'})
        setCount(count+=1)
      })
      .catch((err) => {
        console.log(err.message);
      });
      }
      const searchUser = ()=>{
      
        axios
      .post("/searchuser",{ search}, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((result) => {
        setSearchResults(result.data.user)
        
     
      })
      .catch((err) => {
        console.log(err.message);
      });
      }


  if (loading) {
    return (
      <center>
        <h2>Loading.....</h2>
      </center>
    );
  }
  return (
    <>
  
    <div className="row">
    <div className="input-field " style={{maxWidth:"300px",marginLeft:"20px"}} >
    <i className="material-icons prefix">search</i>
    <input id="icon_prefix" value={search} onChange={(e)=>{setSearch(e.target.value)
      searchUser()
    }} type="text" placeholder="Search user" className="validate" />
    {searchResults.length ? 
    <ul className="collection" style={{display:search !== "" ? "block" : "none"}}>
    {searchResults.map((userEmail)=>{
      return <Link key={userEmail._id} to={`showProfile/${userEmail._id}`}><li className="collection-item" >{userEmail.email}</li></Link>
    })}
  </ul>: 
  null }
   
  </div>
  {posts.length? posts.map((item) => {
    return (
      
      <div key={item._id} className="col s12 m4 offset-m4">
        <div className="card">
          <div className="card-image">
            <img
            src={item.photo}
              style={{ height: "440px" }}
              className="responsive-img "
              alt="img"
            />
          </div>
          <div className="card-content">
            <h5>{item.title}</h5>
            <p>{item.body}</p>
            <br />
           <i style={{color:"grey"}}>Posted by</i> :&nbsp;<Link to={`/showProfile/${item.postedBy._id}`}><i style={{display:"inline",color:"grey"}}>{item.postedBy.name}</i></Link> 
            <br/><br/>
             {item.likes.includes(userId)?<i className="material-icons" onClick={() => { unlikePost(item._id) }}>thumb_down</i>:
             <i
              className="material-icons"
              onClick={() => {
                likePost(item._id);
              }}
            >
              thumb_up
            </i>
             }
            <b>Likes</b> :<b> ({item.likes.length})</b>
         
            
          </div>
          {item.comments.map((comment)=>{

            return(
            <p key={comment._id} style={{marginLeft:"30px"}}><b>{comment.postedBy.name}</b> :  {comment.text}</p>   
            )     
          })}
         
          <div className="input-field col s8 m8">
            <input placeholder="comment" value={comment} onChange={(e)=>setComment(e.target.value)}  type="text" className="validate" />
          </div>
          <br />
          <br />
          <i className="material-icons waves-effect waves-light" onClick={()=>{sendComment(item._id)}}>send</i>
          <i
          className="material-icons waves-effect waves-light"
          onClick={() => {
            deletePost(item._id);
          }}
        >
          delete
        </i>
        </div>
       
        <br />
      </div>
    );
  }) :<center><h4>No posts</h4></center>}
     }
    </div>
    <Footer/>
    </>
  );
}
