import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import axios from "axios";

const Profile = () => {
  const [mypics, setMypics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("")

  useEffect(() => {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem("jwt")}`;
    axios
      .get("/myposts")
      .then((res) => {
        setMypics(res.data.myposts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(()=>{   
      if(image){
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "mukaya");
        data.append("cloud_name", "dux8omdin"); 
        
        fetch("https://api.cloudinary.com/v1_1/dux8omdin/image/upload",{
        method: "post",
        body: data
        }).then(res=>res.json())
        .then(data=>{
            axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${localStorage.getItem("jwt")}`;
            axios.put("/updatepic",{pic:data.url})
            .then(res => {
                console.log(res)
                localStorage.setItem("user",JSON.stringify({...state, pic: res.data.pic}))
                dispatch({type:"UPDATEPIC", payload:res.data.pic})
            })
            .catch(err => {
                console.error(err); 
            })
        }).catch(error=>{
            console.log(error)
        })
      }
  },[image])
  const updatePhoto = async (file) => {
    setImage(file)
  }
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            alt=""
            src={state ? state.pic : "loading..."}
          />
          {/* <button
          style={{margin:"10px 5px 10px 10px"}}
          onClick={()=>updatePhoto()} 
          className="btn waves-effect waves-light">
             Change Image
          </button> */}
          <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Change Image</span>
            <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        </div>
        <div>
          <h5>{state ? state.name : "loading..."}</h5>
          <h5>{state ? state.email : "loading..."}</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h5>{mypics.length} posts</h5>
            <h5>{state ? state.followers.length : "0"} Amis</h5>
            <h5>{state ? state.following.length : "0"} Mes amis</h5>
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              className="item"
              key={item._id}
              alt={item.title}
              src={item.photo}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
