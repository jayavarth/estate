import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './Forgot.css';  // Ensure you have a CSS file for styling this component

export const Forgot = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handlePasswordReset = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("https://estate-dj0k.onrender.com/forgot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, newPassword })
            });

            if (response.ok) {
                setSuccess("Password reset successfully. You can now log in with your new password.");
                setError("");
            } else {
                const data = await response.json();
                setError(data.error);
                setSuccess("");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again later.");
            setSuccess("");
        }
    };

    return (
        <div className="forgot-container">
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
                <label htmlFor="email"><h3>Email:</h3></label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="newPassword"><h3>New Password:</h3></label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <label htmlFor="confirmPassword"><h3>Confirm New Password:</h3></label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <p style={{ color: "white" ,backgroundColor:"lightcoral"}}>{error}</p>}
                {success && <p style={{ color: "white",backgroundColor:"rgb(76, 169, 73)" }}>{success}</p>}
                <button type="submit">Reset Password</button>
            </form>
            <p><Link to="/">Back to Login</Link></p>
        </div>
    );
};

export default Forgot;
