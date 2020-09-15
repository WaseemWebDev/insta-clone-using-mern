import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useParams } from "react-router-dom";


export default function UserProfile() {
  const { id } = useParams();
  const [mypics, setMyPics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [follower,setFollowers] = useState([]);
  let [count,setCount] = useState(0);
  const [userId,setUserId] = useState("");

 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      setUserId(user._id)
    }
    function getMyposts() {
      axios
        .get(`/userprofile/${id}`, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => {
          setProfileImage(res.data.user.photo);
          setMyPics(res.data.postsResult);
          setFollowers(res.data.user)
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    getMyposts();
    return function cleanup() {};
  }, [id,count]);
  
const followUser = (followerId)=>{

  axios
        .post('/follow', {followerId},{
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => {
          
          setCount(count+=1)
          // setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    const unFollowUser = (followerId)=>{

      axios
            .post('/unfollow', {followerId},{
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
              },
            })
            .then((res) => {
            
               setCount(count-=1)
              // setLoading(false);
            })
            .catch((err) => {
              console.log(err.message);
            });
        }



  if (loading) {
    return (
      <center>
        <h3>Loading</h3>
      </center>
    );
  }

  return (
    <>
      <div className="row" style={{ height: "370px" }}>
        <div className="col s12 m2 offset-m4" style={{ padding: "30px" }}>
          <center>
            <img
            src={`${profileImage}`}
              alt="profile"
              className="circle responsive-img"
              style={{ width: "220px", height: "210px" }}
            />
          </center>
        </div>
        <div
          className="col s12 m3"
          style={{ marginTop: "10px", padding: "10px" }}
        >
          <center>
            <h5>{follower.name}</h5>

            <span>
              <b>Posts: </b>
            </span>
            <span>{mypics.length}</span> &nbsp;
            <span>
              <b>Following: </b>
              {follower.following.length}
            </span>
         
            <span>
              <b>Followers: </b>
            </span>
            <span>{follower.followers.length}</span>
            <br/><br/>
            {id === userId?null:
              follower.followers.includes(userId)  ? 
              <button
              className="btn waves-effect waves-light"
              onClick={()=>{unFollowUser(id)}}
            >
            
              UnFollow
            </button>
            :
            <button
            className="btn waves-effect waves-light"
            onClick={()=>{followUser(id)}}
          >
            Follow
          </button> }
          </center>
        </div>
      </div>
      <hr />
      <br />
      <br />
      <br />
      <div className="row">
      {mypics.length !==0 ? 
        mypics.map((item) => {
          return (
            <div key={item._id} className="col s6 m3">
              <center>
                <img
                  src={`${item.photo}`}
                  style={{ height: "340px", width: "440px" }}
                  className="responsive-img "
                  alt="img"
                />
              </center>
            </div>
          );
        }):<center><h4>No posts from this user</h4></center>}
      </div>
    </>
  );
}
