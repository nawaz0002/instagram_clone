import React, {useContext, useRef, useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

const Navbar = () => {
    const history = useHistory();
    const {state, dispatch} = useContext(UserContext);
    const searchModal = useRef(null);
    const sideNavbar = useRef(null);
    const [search, setSearch] = useState("")
    const [hide, setHide] = useState("translateX(-105%)")
    const [searchData, setSearchData] = useState([])

    useEffect(() => {
        M.Modal.init(searchModal.current);
        M.Modal.init(sideNavbar.current);
    }, [])

    const renderList = () => {
        if(state){
            return [
            <li key="1"><i data-target="modal1" className="material-icons search large modal-trigger" style={{color: "black", cursor: 'pointer'}}> search</i> </li>,
            <li key="2"><Link to="/create">Create post</Link></li>,
            <li key="3"><Link to="/profile">Profile</Link></li>,
            <li key="4"><Link to="/following-posts">My Following Posts</Link></li>,
            <li key="5">
                <button className="btn #c62828 red darken-3 logout" 
                onClick={() => {
                    localStorage.clear();
                    dispatch({type: "CLEAR", })
                    history.push('/signin')
                }}>
                    Logout
                </button>
            </li>
        ]
        }else{
            return [
                <li key="6"><Link to="/signin">SignIn</Link></li>,
                <li key="7"><Link to="/signup">Register</Link></li>
            ]
        }
    }

    const searchUser = (query) => {
        setSearch(query);
        fetch('auth/search-user', {
            method: "post",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                query: query
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setSearchData(data.user)
        })
        .catch(err => console.log(err))
    }

    return (
        <nav>
            <div className="nav-wrapper white" style={{padding: '0 2rem'}} >
                <Link to={state ? "/" : '/signin'} className="brand-logo left">Instagram</Link>
                <a href="#!" data-target="mobile-demo" className="sidenav-trigger right"><i className="material-icons">menu</i></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                {renderList()}
            </ul>
            <ul className="sidenav " style={{transform : "translateX(-105%) !important", color: 'red'}} id="mobile-demo">
                {renderList()}
            </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{color: 'black'}}>
                <div className="modal-content">
                    <input 
                        type="text" 
                        value={search}
                        placeholder="Search Users" 
                        onChange={e => searchUser(e.target.value)}
                    />
                    <ul className="collection">
                            {searchData.length > 0 ? searchData.map(user => {
                                return(
                                    <Link to={state._id !== user._id ?  `/profile/${user._id}` : '/profile'} onClick={() => {
                                        setSearch('')
                                        M.Modal.getInstance(searchModal.current).close()
                                    }}>
                                        <div className="collection-item avatar">
                                            <img src={user.pic} alt="" className="circle"/>
                                            <span className="title">{user.name}</span>
                                        </div>
                                    </Link>
                                )
                            }) : 'No data'}
                                
                    </ul>
                </div>
                <div className="modal-footer">
                    <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button>
                </div>
            </div>
            {/* <nav>
    <div className="nav-wrapper">
        <a href="#!" className="brand-logo">Logo</a>
        <a href="#!" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
        <ul className="right hide-on-med-and-down">
            <li><a href="sass.html">Sasssss</a></li>
            <li><a href="badges.html">Components</a></li>
            <li><a href="collapsible.html">Javascript</a></li>
            <li><a href="mobile.html">Mobilessssss</a></li>
        </ul>
        </div>
    </nav> */}
    {/* <div>
    <ul className="sidenav " id="mobile-demo" ref={sideNavbar}>
        <li><a href="sass.html">Sass</a></li>
        <li><a href="badges.html">Componentsss</a></li>
        <li><a href="collapsible.html">Javascriptttttttttt</a></li>
        <li><a href="mobile.html">Mobile</a></li>
    </ul>
</div> */}

        </nav>
    )
}

export default Navbar
