import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
import { useState } from "react";


function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setMessage("");
    setError("");
    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password
        })
      });
      if (response.ok) {
        // Fetch user info to get user_id
        const userInfoRes = await fetch(`http://localhost:8000/users/?username=${data.username}`);
        let userId = null;
        if (userInfoRes.ok) {
          const userInfo = await userInfoRes.json();
          userId = userInfo.user_id;
        }
        login(userId, false); // Not remembering on register
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const resData = await response.json();
        setError(resData.detail || "Registration failed.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };
    
  return (
    <div className="login-background">
      <div className="wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Register an account</h1>
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Choose a username" 
              {...register("username", { required: "Username is required" })}
            />
            <FaUser className="icon" />
          </div>
          {errors.username && <span className="error">{errors.username.message}</span>}
          
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Enter your email" 
              {...register("email", { required: "An email is required" })}
            />
          </div>

          <div className="input-box">
            <input 
              type="password" 
              placeholder="Choose a password" 
              {...register("password", { required: "Password is required" })}
            />
            <FaLock className="icon" />
          </div>
          {errors.password && <span className="error">{errors.password.message}</span>}

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}

          <button type="submit">Register</button>

          <div className="register-link">
            <p><a href="/login">Back to login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;