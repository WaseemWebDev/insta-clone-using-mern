import React, { useContext,useEffect,useState} from "react";
import Navbar from "./components/navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/profile";
import CreatePost from "./components/CreatePost";
import UserProfile from "./components/UserProfile";
import ResetPassword from "./components/ResetPassword";
import SaveNewPassword from "./components/SaveNewPassword";
import MyFollowing from "./components/myFollowingPosts";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import { globalContext } from "./GlobalProvider/state";
import {useHistory} from 'react-router-dom';
function App() {
  const [loadFunction,setLoadFunction] = useState(true)
  const history = useHistory();
  const { addUser } = useContext(globalContext);

  useEffect(() => {
    const user = localStorage.getItem("jwt");
    if(loadFunction){
        if (user) {
           addUser(user);
        }
        else{
          if(!history.location.pathname.startsWith('/resetpassword') &&  !history.location.pathname.startsWith('/save-password') ){
            history.push("/login")
          }
        }
    }
    setLoadFunction(false)
   

  },[history,addUser,loadFunction]);
  return (
    <>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/Signup">
            <Signup />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/createpost">
            <CreatePost />
          </Route>
          <Route exact path="/showProfile/:id">
            <UserProfile />
          </Route>
          <Route exact path="/resetpassword">
          <ResetPassword />
        </Route>
          <Route exact path="/save-password/:token">
          <SaveNewPassword />
        </Route>
          <Route exact path="/myfollowing">
          <MyFollowing />
        </Route>
        </Switch>
        
        
    </>
  );
  
}

export default App;
