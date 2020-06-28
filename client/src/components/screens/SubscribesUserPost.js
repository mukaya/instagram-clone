import React,{useEffect, useState, useContext} from "react";
import { UserContext } from "../../App"
import axios from "axios";
import {toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {Link} from "react-router-dom"
toast.configure()

const SubcribesUserPost = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext)
    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
        axios.get("/getsubpost")
        .then(res => {
            setData(res.data.allpost)
        })
        .catch(err => {
            console.log(err); 
        })
    },[])
    const likePost = (id) => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
      axios.put("/like",{postId: id})
      .then(res => {       
        const newData = data.map(item=>{
          if(item._id === res.data._id){
            return res.data
          }else{
            return item
          }
        })
        setData(newData)
        
      })
      .catch(err => {
        console.error(err); 
      })
    }
    const unLikePost = (id) => {
      axios.put("/unlike",{postId: id})
      .then(res => {
        //console.log(res)
        const newData = data.map(item=>{
          if(item._id === res.data._id){
            return res.data
          }else{
            return item
          }
        })
        setData(newData)
      })
      .catch(err => {
        console.error(err); 
      })
    }
    const makeComment = (text, postId) => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
      axios.put("/comment",{text,postId})
      .then(res => {
        const newData = data.map(item=>{
          if(item._id === res.data._id){
            return res.data
          }else{
            return item
          }
        })
        setData(newData)
      })
      .catch(err => {
        console.error(err); 
      })
    }
    const deletePost = (postId) => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;
      axios.delete(`/deletepost/${postId}`)
      .then(res => {
        toast.success("succefully deleted", toast.POSITION.TOP_RIGHT)
        const newData = data.filter(item=>{
          return item._id !== res.data._id
        })
        setData(newData)
      })
      .catch(err => {
        console.error(err); 
      })
    }
  return (
    <div className="home">
        {data.map((post)=>{
            return(
                <div className="card home-card" key={post._id}>
                <h5 style={{padding:"5px"}}><Link to={post.postedBy._id !== state._id ?"/profile/"+post.postedBy._id:"/profile/"}>{post.postedBy.name}</Link> {post.postedBy._id === state._id
                 && <i className="material-icons" style={{float: "right"}}
                 onClick={()=>deletePost(post._id)}
                 >
                   delete
                 </i>}
                </h5>
                <div className="card-image">
                  <img
                    src={post.photo}
                    alt=""
                  />
                </div>
                <div className="card-content">
                  <i className="material-icons" style={{ color: "red" }}>
                    favorite
                  </i>
                  {
                    post.likes.includes(state._id)
                    ?
                    <i className="material-icons"
                    onClick={()=>unLikePost(post._id)}
                    >
                      thumb_down
                    </i>
                    :
                    <i className="material-icons"
                    onClick={()=>likePost(post._id)}
                    >
                      thumb_up
                    </i>
                    
                  }
                    <h6>{post.likes.length} Likes</h6>
                    <h6>{post.title}</h6>
                    <p>{post.body}</p>
                    {
                      post.comments.map(record=>{
                        return(
                        <h6 key={record._id}><span style={{fontWeight: "bold"}}>{record.postedBy.name}</span>  {record.text}</h6>
                        )
                      })
                    }
                    <form onSubmit={(e)=>{
                      e.preventDefault()
                      makeComment(e.target[0].value,post._id)
                      e.target[0].value = ""
                    }}>
                      <input type="text" placeholder="Add a comment" />
                    </form>
                </div>
              </div>
            )
        })}
    </div>
  );
};

export default SubcribesUserPost;
