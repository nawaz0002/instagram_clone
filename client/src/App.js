import React, {createContext ,useReducer, useEffect, useContext} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';

import Home from './components/screens/Home'
import SignIn from './components/screens/SignIn'
import Profile from './components/screens/Profile'
import SignUp from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import followingPosts from './components/screens/followingPosts';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';

import { reducer, initialState } from '../src/reducer/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
      dispatch({type: "USER", payload: user})
      // history.push('/');
    }else{
      if(!history.location.pathname.startsWith('/reset'))
          history.push('/signin')
    }
  }, [])
  return(
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/profile/:userId" exact component={UserProfile} />
      <Route path="/create" component={CreatePost} />
      <Route path="/following-posts" component={followingPosts} />
      <Route exact path="/reset-password" component={Reset} />
      <Route path="/reset/:token" component={NewPassword} />
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing /> 
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
