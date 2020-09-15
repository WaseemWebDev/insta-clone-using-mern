import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";


export default function Profile() {
  const [mypics, setMyPics] = useState([]);
  const [follow,setFollowers]  = useState([])
  const [loading,setLoading] = useState(true)
  

  useEffect(() => {
   
    function getMyposts() {
      axios
        .get("/mypost", {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
        .then((res) => {
         
          setFollowers(res.data.user)
          setMyPics(res.data.myPost);
          setLoading(false)
          // setFollowers(res.data.myPost[0].postedBy)
         
        })
        .catch((err) => {
          console.log(err);
          setLoading(false)
        });
    }
    getMyposts();
    
  }, []);
  if(loading === true){
    return <center><h4>Loading Profile.......</h4></center>
  }
console.log(follow.photo.substr(7))

  return (
    <>
      <div className="row" style={{ height: "370px" }}>
        <div className="col s12 m2 offset-m4" style={{ padding: "30px" }}>
          <center>
         {follow.length !== 0 ?  <img
             
          src={follow.photo}

          
            alt="profile"
            className="circle responsive-img"
            style={{ width: "200px", height: "210px" }}
          /> : <h2>loading</h2>}
           
          </center>
        </div>
        <div
          className="col s12 m3"
          style={{ marginTop: "10px", padding: "10px" }}
        >
        
          <center>
            <h5>{follow.name}</h5>
            <span>
              <b>Posts: </b>
            </span>
            <span>{mypics.length}</span> &nbsp;
           
           
            <span>
              <b>Following: </b>
              {follow.length === 0 && follow.length ==="" ?<h6>loading...</h6>:!follow.following ? "0" : follow.following.length }
            </span>
            <span>
            <b>Followers: </b>
            {follow.length === 0 && follow.length ==="" ?<h6>loading....</h6>:!follow.followers ? "0": follow.followers.length}
          </span>

          </center>
        </div>
      </div>
      <hr />
      <br />
      <br />
      <br />
      <div className="row">
      {mypics.length !== 0 ?mypics.map((item) => {
        return (
          <div key={item._id} className="col s6 m3">
            <center>
              <img
                src={`${item.photo}`}
                style={{ height: "380px", width: "490px" }}
                className="responsive-img "
                alt="img"
              />
            </center>
          </div>
        );
      }): <center><h2>No posts yet</h2></center> }
        
      </div>
    </>
  );
}
