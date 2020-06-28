import React, { useState, useContext } from "react";
import { UserContext } from "../../App"
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

toast.configure();

const Signin = () => {

  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const postData = () => {
    axios
      .post("/signin", { password, email })
      .then((res) => {
         console.log(res)
        //toast.success(res.data.message, toast.POSITION.TOP_RIGHT)
         localStorage.setItem("jwt", res.data.token)
         localStorage.setItem("user", JSON.stringify(res.data.user))
         dispatch({type:"USER", payload: res.data.user})
         toast.success("Successfuly signed", toast.POSITION.TOP_RIGHT)
         history.push("/")
      })
      .catch((err) => {
        if (err) {
          toast.error(err.response.data.error, toast.POSITION.TOP_RIGHT);
        }
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field input">
        <h2>osee-sociaux</h2>
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
        <button onClick={()=>postData()} className="btn waves-effect waves-light">
          Login
        </button>
        <h5>
          <Link to="/signup">Don't have an acount</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
