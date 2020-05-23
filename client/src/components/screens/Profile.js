import React, { useEffect, useState, useContext, Fragment } from 'react';
import boy from '../../images/boy.jpg';
import './profile.css'
import { UserContext } from '../../App';
import loading  from '../../images/200.gif'

const Profile = () => {
    const [myposts, setMyPosts] = useState([])
    const {state, dispatch} = useContext(UserContext);
    const [image, setImage]  = useState("");
    const [url, setUrl]  = useState(undefined);

    useEffect(() => {
        fetch('post/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(mypost => {
            console.log(state)
            console.log(mypost.posts)
            setMyPosts(mypost.posts)
        })
    },[])

    const deletePost = (postId) => {
        fetch(`post/delete-post/${postId}`,{
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(deletedData => {
            console.log(deletedData)
            const newData = myposts.filter(item => {
                return item._id != deletedData._id
            })
            setMyPosts(newData)
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        if(image){
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "instaclone");
            data.append("cloud_name", "nawaz0002")
            fetch("https://api.cloudinary.com/v1_1/nawaz0002/image/upload", {
                method: "post",
                body: data
            })
            .then(res => res.json())
            .then(data => {
                
                fetch("/auth/upload-pic", {
                        method: "put",
                        headers:{
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " +localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    })
                    .then(res => res.json())
                    .then(result => {
                        console.log(state, result.pic)
                        localStorage.setItem("user", JSON.stringify({...state, pic: result.pic}));
                        dispatch({type: "UPDATE_PHOTO", payload: result.pic})
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
    }, [image])

    const uploadPhoto = (file) => {
        setImage(file)
    }
console.log(state)
    return (
        <div>
            {state ?  (<Fragment>
            <div className="profile-container">
                <div className="profile-first">
                    <img src={state ? state.pic : 'loading'} className="profile-img" alt="" />
                    <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Profile</span>
                        <input type="file" onChange={e => uploadPhoto(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input 
                            className="file-path validate" 
                            type="text" 
                        />
                    </div>
                </div>
                </div>
                <div className="profile-second">
                    <h5><b>{state && state.name}</b></h5>
                    <div className="profile-name-container">
                        <h6><b>{myposts.length}</b> posts</h6>
                        <h6><b>{state ? state.followers.length : "0"}</b> followers</h6>
                        <h6><b>{state ? state.following.length : "0"}</b> following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery-container">
                {
                    myposts.map(post => {
                        return(
                            <div className="profile-image-container">
                                <img key={post._id} src={post.photo} alt={post.photo} className="profile-item"/>
                                <i className="material-icons delete-post" onClick={() => deletePost(post._id)}  style={{color: "red"}}> delete</i>            
                            </div>                        
                        )
                    })
                }
            </div>
             } </Fragment> ): <h1><img src={loading} alt="loading..." style={{width: '200px', margin: 'auto', display: 'block'}}/></h1>}
        </div>
    )
}

export default Profile
