import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../../AuthContext";


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = React.useState("");

  const onSubmit = async (data) => {
    // console.log("Login attempt:", data);
    // TODO: Add real authentication here - send data to backend
    // For now, just log in the user
    // login(data.rememberMe); // Pass the remember me state
    // navigate("/"); // Redirect to home page
    setError("");
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        })
      });
      if (response.ok) {
        login(data.rememberMe);
        navigate("/");
      } else {
        const resData = await response.json();
        let errorMsg = resData.detail;
        if (Array.isArray(errorMsg)) {
          errorMsg = errorMsg.map(e => e.msg).join(", ");
        } else if (typeof errorMsg === "object") {
          errorMsg = JSON.stringify(errorMsg);
        }
        setError(errorMsg || "Login failed.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div className="login-background">
      <div className="wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Login</h1>
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Username" 
              {...register("username", { required: "Username is required" })}
            />
            <FaUser className="icon"/>
          </div>
          {errors.username && <span className="error">{errors.username.message}</span>}
          
          <div className="input-box">
            <input 
              type="password" 
              placeholder="Password" 
              {...register("password", { required: "Password is required" })}
            />
            <FaLock className="icon"/>
          </div>
          {errors.password && <span className="error">{errors.password.message}</span>}

          {error && <div className="error">{error}</div>}

          <div className="remember-forgot">
            <label>
              <input type="checkbox" {...register("rememberMe")}/> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit">Login</button>

          <div className="register-link">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}