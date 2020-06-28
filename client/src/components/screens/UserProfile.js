import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from "../../App"
import {useParams} from "react-router-dom"
import axios from "axios"

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
        axios.get(`/user/${userid}`)
        .then(res => {
            setUserProfile(res.data)
        })
        .catch(err => {
            console.log(err); 
        })
    },[])

    const followUser = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
        axios.put("/follow",{followId: userid})
        .then(res => {
            console.log(res.data.following)
            //setUserProfile(res.data)
            dispatch({type:"UPDATE",payload:{following: res.data.following, followers: res.data.followers}})
            localStorage.setItem("user", JSON.stringify(res.data))
            setUserProfile((prevState)=>{
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers:[...prevState.user.followers, res.data._id]
                    }
                }
            })
            setShowFollow(false)
        })
        .catch(err => {
            console.error(err); 
        })
    }
    const unfollowUser = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
        axios.put("/unfollow",{unfollowId: userid})
        .then(res => {
            console.log(res.data.following)
            //setUserProfile(res.data)
            dispatch({type:"UPDATE",payload:{following: res.data.following, followers: res.data.followers}})
            localStorage.setItem("user", JSON.stringify(res.data))
            setUserProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== res.data._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })
            setShowFollow(true)
        })
        .catch(err => {
            console.error(err); 
        })
    }
    return (
        <>
        { userProfile ?

            <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    alt="" src={userProfile.user.pic}/>
                </div>
                <div>
                    <h5>{userProfile.user.name}</h5>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between", width:"108%"}}>
                        <h5>{userProfile.posts.length} posts</h5>
                        <h5>{userProfile.user.followers.length} Amis</h5>
                        <h5>{userProfile.user.following.length} Mes amis</h5>
                    </div>
                    {showFollow?
                    <button style={{margin:"10px"}} onClick={()=>followUser()} className="btn waves-effect waves-light">
                    suivre
                    </button>
                    :
                    <button style={{margin:"10px"}} onClick={()=>unfollowUser()} className="btn waves-effect waves-light">
                            ne pas suivre
                    </button>
                    }                  
                </div>
            </div>
            <div className="gallery">
                {userProfile.posts.map((item)=>{
                    return(
                    <img className="item" key={item._id} alt={item.title} src={item.photo}/>
                    )
                })}
            </div>
            </div>

        : <h2>Loading...</h2>
        }
        </>
    )
}

export default UserProfile
