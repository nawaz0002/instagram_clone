import React, { useState, useEffect, useContext, Fragment } from 'react';
import boy from '../../images/boy.jpg';
import { UserContext } from './../../App';
import { Link } from 'react-router-dom';
import loading  from '../../images/200.gif'

const Home = () => {
    const [data, setData] = useState([]);
    const [comment, setComment] = useState('');
    const {state, dispatch} = useContext(UserContext)

    useEffect(() => {
        fetch('post/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(postData => {
            setData(postData.posts);
            console.log(postData.posts)
        })
    }, ['data'])

    const postLike = (id) => {
        fetch('post/like', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item => {
                if(item._id == result._id){
                    return result;
                }
                return item
            })
            setData(newData)
        })
        .catch(err => console.log(err))
    };

    const postUnLike = (id) => {
        fetch('post/unlike', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item => {
                if(item._id == result._id){
                    return result;
                }
                return item
            })
            setData(newData)
        })
        .catch(err => console.log(err))
    }

    const postComment = (text, postId) => {
        fetch('post/comment', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
        .then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id == result._id){
                    return result;
                }
                return item
            })
            setData(newData)
        })
        .catch(err => console.log(err))
    }
    
    const deleteComment = (postId, commentId) => {
        fetch(`post/delete-comment/${postId}/${commentId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item => {
                if(item._id == result._id){
                    return result;
                }
                return item
            })
            setData(newData)
        })
        .catch(err => console.log(err))
    }

    return (
        <div>
            {   data.length > 0 ? data.map(post => {
                    return (
                    <div className="card home-card" key={post._id}>
                        <div className="profile-user-container">
                            <img src={post.postedBy.pic} className="profile-user" alt="" width="30"/>
                            <p  style={{paddingLeft: "1.5rem"}} className="name-user">
                                <Link to={post.postedBy._id != state._id ? `/profile/${post.postedBy._id}` : `/profile`}>{post.postedBy.name}
                                </Link>
                            </p>
                        </div>
                        <div className="card-image">
                            <img src={post.photo} class="profile-image" alt=""/>
                        </div>
                        <div className="card-content">
                            {/* <i className="material-icons">favorite_border</i> */}
                            {
                                post.likes.includes(state._id) 
                                ? 
                                    <i className="material-icons like-btn" onClick={() => postUnLike(post._id)}  style={{color: "red"}}> favorite</i> 
                                :          
                                    <i className="material-icons like-btn" onClick={() => postLike(post._id)}>favorite_border</i> 
                            }
                            
                            <h6>{post.likes.length} likes</h6>
                            <h6><b>{post.title}</b></h6>
                            <p>{post.body}</p>
                            <hr/>
                            {
                                post.comments.map(comment => {
                                    return(
                                        <Fragment>
                                            <div className="comment-container">
                                                <p><span style={{fontWeight:'500'}}><b>{comment.postedBy.name}</b></span> {comment.text}</p>
                                                <p>{comment.postedBy._id == state._id ? <i className="material-icons delete-cmt" onClick={() => deleteComment(post._id, comment._id)}>delete</i> : ''}</p>
                                            </div>
                                        </Fragment>
                                    )
                                })
                            }
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                postComment(e.target.comment.value, post._id)
                            }}>
                                <input type="text" name="comment" placeholder="Add a comment" />
                            </form>
                        </div>
                    </div>)
                }
                    
                )
                : <h1><img src={loading} alt="loading..." style={{width: '200px', margin: 'auto', display: 'block'}}/></h1>
            }
        </div>
    )
}

export default Home
