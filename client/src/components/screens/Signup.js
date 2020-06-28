import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();
const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(()=>{
    if(url){
      uploadFields()
    }
  },[url])
  const uploadPic = async () =>{
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mukaya");
    data.append("cloud_name", "dux8omdin"); 
    await fetch("https://api.cloudinary.com/v1_1/dux8omdin/image/upload",{
        method: "post",
        body:data
    }).then(res=>res.json())
    .then(data=>{
        setUrl(data.url)
    }).catch(error=>{
        console.log(error)
    })
  }
  const uploadFields = async () => {
    const objectPost = {
      name,
      password,
      email,
      pic:url
    };
    await axios
      .post("/signup", objectPost)
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        return history.push("/Signin");
      })
      .catch((err) => {
        if (err) {
          return toast.error(err.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
  }
  const PostData = () => {
    if(image){
      uploadPic()
    }else{
      uploadFields()
    }
   
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field input">
        <h2>osee-sociaux</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Image</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button onClick={PostData} className="btn waves-effect waves-light">
          Create an acount
        </button>
        <h5>
          <Link to="/signin">Already have an acount</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
