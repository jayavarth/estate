import React, { useState } from "react";
import '/src/SignBar.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/src/estate.png';

export const SignBar = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState(""); 
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
        return emailRegex.test(email);
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setError("Only emails from gmail.com and yahoo.com are allowed");
            return;
        }

        try {
            const response = await fetch("https://estate-dj0k.onrender.com/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, userType }) 
            });

            const data = await response.json();
            console.log("Response data:", data); 

            if (response.ok) {
                const token = data.token;
                localStorage.setItem("token", token);
                localStorage.setItem("username", username); 

                console.log("UserType from response:", data.userType); 

                if (data.userType === "Admin") {
                    navigate("/Admindb", { state: { token: token } });
                } else if (data.userType === "Client") {
                    navigate("/Client/${data.user.userId}");
                } else {
                    setError("Invalid user type");
                } 
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again later.");
        }
    };


    return (
        <div>
            {/* <nav className="nav-signup">
                <div className="img">
                    <img src={logo} alt="logo" width={50} height={50} />
                </div>
                <ul className="links">
                    <li><Link to="/Login">Login</Link></li>
                    <li><Link to="/Choosesale">Submit Property</Link></li>
                    <li><Link to="/Client">Buy Property</Link></li>
                </ul>
            </nav> */}
            <div className="us">
                <h2>WHY US?</h2>
                <h2>
                    <p><img src={logo} alt="logo" width={50} height={50}></img>Post your property for FREE</p>
                    <p><img src={logo} alt="logo" width={50} height={50}></img>Get instant response</p>
                    <p><img src={logo} alt="logo" width={50} height={50}></img>Showcase your property</p>
                    <p><img src={logo} alt="logo" width={50} height={50}></img>Contact sellers</p> 
                </h2>
            </div>
            <div className="signup">
                <form onSubmit={handleSignup}>
                    <h3 className="title">SIGNUP</h3>
                    <label htmlFor="name"><h3>Username: </h3></label>
                    <input type="text" placeholder="Enter Username" name="name" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <label htmlFor="email"><h3>Email: </h3></label>
                    <input type="email" placeholder="Enter Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="password"><h3>Password: </h3></label>
                    <input type="password" placeholder="Enter Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label htmlFor="userType"><h3>User Type: </h3></label>
                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="">Select User Type</option>
                        <option value="Admin">Admin/Agent</option>
                        <option value="Client">Client</option>
                    </select>
                    <h4>Already a member? <a href="/Login">Login</a></h4>
                    <button type="submit">Signup</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignBar;
