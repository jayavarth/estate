import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export const NavBar = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setError("Only emails from gmail.com and yahoo.com are allowed");
            return;
        }

        try {
            const response = await fetch("https://estate-dj0k.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login response data:", data);

                if (!data.user || !data.token) {
                    setError("Invalid response from server");
                    return;
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("userId", data.user.userId);

                console.log("Login successful");
                console.log("Username:", data.user.username);
                console.log("UserId:", data.user.userId);
                console.log("Token:", data.token);

                if (data.user.userType === "Admin") {
                    navigate(`/Admindb`);
                } else if (data.user.userType === "Client") {
                    navigate(`/Client`); // Pass userId as URL parameter
                } else {
                    setError("Invalid user type");
                }
            } else {
                const data = await response.json();
                setError(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div>
            {/* <nav className="nav">
                <div className="img">
                    <img src={logo} alt="logo" width={50} height={50} />
                </div>
                <ul className="links">
                    <li><Link to="/SignBar">Signup</Link></li>
                    <li><Link to="/Choosesale">Submit Property</Link></li>
                    <li><Link to="/Client">Buy Property</Link></li>
                </ul>
            </nav> */}
            <div className="new">
                <div className="content">
                    <h1 className="welcome">Your Castle Awaits<br />Browse Our Listings</h1>
                    <div className="login-form">
                        <form onSubmit={handleLogin}>
                            <h2>LOGIN</h2>
                            <label htmlFor="email"><h3>Email: </h3></label>
                            <input type="email" placeholder="Enter Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <label htmlFor="password"><h3>Password: </h3></label>
                            <input type="password" placeholder="Enter Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <p><Link to="/forgot">Forgot password?</Link></p>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <button type="submit">Login</button>
                            <h3>Not a member yet? <Link to="/SignBar">Signup</Link></h3>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
