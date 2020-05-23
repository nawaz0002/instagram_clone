import React, {useState} from 'react'
import M from 'materialize-css';
import { useHistory} from 'react-router-dom';

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle]  = useState("");
    const [body, setBody]  = useState("");
    const [image, setImage]  = useState("");
    const [url, setUrl]  = useState("");

    const postDetails = () => {
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
            console.log(data.url)
            setUrl(data.url)
            fetch('post/createpost', {
                method: "post",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " +localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic: data.url
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    return M.toast({html: data.error, classes: "#c62828 red darken-3"})
                }
                M.toast({html: "created post successfully", classes: "#43a047 green darken-1"})
                history.push('/')
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
        
        
    }

    return (
        <div className="card input-field create-post-container">
            <input 
                type="text" 
                placeholder="title" 
                onChange={e => setTitle(e.target.value)}
            />
            <input 
                type="text" 
                placeholder="body" 
                onChange={e => setBody(e.target.value)}
            />
            <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Upload Image</span>
                <input type="file" onChange={e => setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input 
                    className="file-path validate" 
                    type="text" 
                />
            </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postDetails()}>
                Submit post
            </button>
        </div>
    )
}

export default CreatePost
