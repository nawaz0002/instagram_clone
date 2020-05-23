import React, { useEffect, useState, useContext, Fragment } from 'react';
import boy from '../../images/boy.jpg';
import './profile.css'
import { UserContext } from '../../App';
import {useParams} from 'react-router-dom'
import loading  from '../../images/200.gif'

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const {state, dispatch} = useContext(UserContext)
    const { userId } = useParams();
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId) :true)
    
    useEffect(() => {
        fetch(`/user/${userId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(userProfile => {
            // console.log(userProfile)
            setUserProfile(userProfile)
            // dispatch({type: "USER_PROFILE", payload: userProfile})
        })
    },[])

    const followUser = () => {
        fetch(`/follow`,{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userId
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            dispatch({
                type: 'UPDATE', 
                payload: {following : data.following, followers: data.followers}
            })
            localStorage.setItem("user", JSON.stringify(data))
            setShowFollow(false);
            setUserProfile((prevState) => {
                return{
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id],
                    }
                }
            })
        })
    }

    const unFollowUser = () => {
        fetch(`/unfollow`,{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            dispatch({
                type: 'UPDATE', 
                payload: {following : data.following, followers: data.followers}
            })
            localStorage.setItem("user", JSON.stringify(data))
            setShowFollow(true);
            setUserProfile((prevState) => {
                const newFollower = prevState.user.followers.filter(item => item != data._id)
                return{
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })
        })
    }


    return (
        <Fragment>
            {userProfile ? (
                <div>
                <div className="profile-container">
                    <div className="profile-first">
                        <img src={userProfile.user.pic }  class="profile-img" alt="" />
                    </div>
                    <div className="profile-second">
                        <h4>{userProfile.user.name}</h4>
                        <h6>{userProfile.user.email}</h6>
                        <div className="profile-name-container">
                            <h6>{userProfile.posts.length} posts</h6>
                            <h6>{userProfile.user.followers.length} followers</h6>
                            <h6>{userProfile.user.following.length} following</h6>
                        </div>
                        {
                            showFollow ?  
                                <button style={{marginTop: "10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => followUser()}>
                                    Follow
                                </button> 
                                :
                                <button style={{marginTop: "10px"}} className="btn waves-effect waves-light #64b5f6 blue    darken-1" onClick={() => unFollowUser()}>
                                    Unfollow
                                </button>
                        }
                        
                    </div>
                </div>
                <div className="gallery-container">
                    {
                        userProfile.posts.map(post => {
                            return(
                                <div className="profile-image-container">
                                    <img key={post._id} src={post.photo} alt={post.photo} className="profile-item"/>
                                </div>                        
                            )
                        })
                    }
                </div>
            </div>
            ) : <h1><img src={loading} alt="loading..." style={{width: '200px', margin: 'auto', display: 'block'}}/></h1>}
        </Fragment>
    )
}

export default UserProfile
