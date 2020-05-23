import React, {useState, useContext} from 'react';
import { Link , useHistory, useParams} from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';

const SignIn = () => {
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory()
    const [password, setPassword] = useState("");
    const {token} = useParams();
    const PostData = () => {
        console.log(token)

        fetch('/auth/new-password', {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                password,
                token:token 
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                return M.toast({html: data.error, classes: "#c62828 red darken-3"})
            }
            M.toast({html: data.message, classes: "#43a047 green darken-1"})
            history.push('/signin')
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input 
                    type="password" 
                    value={password}
                    placeholder="Enter new password" 
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => PostData()}>
                    Reset Password
                </button>
                <h6><Link to="/signup">Don't have an account ? <span>Register</span></Link></h6>
            </div> 
        </div>

    )
}

export default SignIn
