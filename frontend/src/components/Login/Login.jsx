import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../../AuthContext";


function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Login attempt:", data);
    // TODO: Add real authentication here - send data to backend
    // For now, just log in the user
    login(); // Set user as authenticated
    navigate("/"); // Redirect to home page
  };

  return (
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

        <div className="remember-forgot">
          <label>
            <input type="checkbox" {...register("rememberMe")}/> Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit">Login</button>

        <div className="register-link">
          <p>Don't have an account? <a href="#">Register</a></p>
        </div>
      </form>

    </div>
  );
}

export default Login;