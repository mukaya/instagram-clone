import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'

toast.configure();
const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
 
  useEffect(()=>{
    if(url){
      createpost()
    }
  },[url])
  const postPhoto = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mukaya");
    data.append("cloud_name", "dux8omdin");     
    await fetch("https://api.cloudinary.com/v1_1/dux8omdin/image/upload",{
        method: "post",
        body: data
    }).then(res=>res.json())
    .then(data=>{
         setUrl(data.url)
    }).catch(error=>{
        console.log(error)
    })
  }
  const createpost = async () => {   
    const objectPost = {
      title,
      body,
      pic:url
    };
    await axios
      .post("/createpost", objectPost)
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        return history.push("/");

      })
      .catch((err) => {
        if (err) {
          return toast.error(err.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }); 
  }
  const postDetails = () => {
    if(image){
      postPhoto()
    }else{
      createpost()
    }
  };
  return (
    <div
      className="card input-filed"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button onClick={postDetails} className="btn waves-effect blue darken-1">
        Post a new
      </button>
    </div>
  );
};

export default CreatePost;
