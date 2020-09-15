import React, { useEffect, useState } from "react";
import axios from "axios";
import M from 'materialize-css';
import {Link} from 'react-router-dom';


export default function MyFollowing() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  let [count, setCount] = useState(0);
  let [comment, setComment] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      setUserId(user._id)
    }
    
    function getposts() {
      axios
        .get("/followersposts", {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => {
          setPosts(res.data.data);
          setLoading(false);
          console.log(res.data.data)
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

  if (loading) {
    return (
      <center>
        <h2>Loading.....</h2>
      </center>
    );
  }
  
  return (
    <div className="row">
      {posts.map((item) => {
        return (
          <div key={item._id} className="col s12 m4 offset-m4">
            <div className="card">
              <div className="card-image">
               <Link to={`/showProfile/${item.postedBy._id}`}><h6>{item.postedBy.name}</h6></Link> 
                <img
                  src={`${item.photo}`}
                  style={{ height: "440px" }}
                  className="responsive-img "
                  alt="img"
                />
              </div>
              <div className="card-content">
                <h5>{item.title}</h5>
                <p>{item.body}</p>
                <br />
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
                {item.likes.length}
                &nbsp;
               
              </div>
              {item.comments.map((comment)=>{

                return(
                <p key={comment._id} style={{marginLeft:"30px"}}>{comment.postedBy.name} :  {comment.text}</p>   
                )     
              })}
             
              <div className="input-field col s8 m8">
                <input placeholder="comment" value={comment} onChange={(e)=>setComment(e.target.value)}  type="text" className="validate" />
              </div>
              <br />
              <br />
              <i className="material-icons" onClick={()=>{sendComment(item._id)}}>send</i>
              <i
              className="material-icons"
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
      })}
    </div>
  );
}
