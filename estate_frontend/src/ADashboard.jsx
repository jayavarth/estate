import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './ADashboard.css';
import logo from './image.png';

export const AdminDashboard = () => {
    const [username, setUsername] = useState("");
    const [profile, setProfile] = useState({});
    // const [recentActivity, setRecentActivity] = useState([]);
    // const [stats, setStats] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const token = localStorage.getItem("token");

        if (storedUsername && token) {
            setUsername(storedUsername);
            fetchProfileDetails(storedUsername, token);
            // fetchRecentActivity(storedUsername, token);
            // fetchStats(storedUsername, token);
        } else {
            navigate("/SignBar");
        }
    }, [navigate]);

    const fetchProfileDetails = async (username, token) => {
        try {
            const response = await fetch(`https://estate-dj0k.onrender.com/api/profile/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setProfile(data);
            } else {
                console.error("Failed to fetch profile details:", data.error);
            }
        } catch (error) {
            console.error("Error fetching profile details:", error);
        }
    };

    // const fetchRecentActivity = async (username, token) => {
    //     try {
    //         const response = await fetch(`https://estate-dj0k.onrender.com/api/recent-activity/${username}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    
    //         // Check if the response is in JSON format
    //         const contentType = response.headers.get('content-type');
    //         if (contentType && contentType.includes('application/json')) {
    //             const data = await response.json();
    //             if (response.ok) {
    //                 setRecentActivity(data);
    //             } else {
    //                 console.error("Failed to fetch recent activity:", data.error);
    //             }
    //         } else {
    //             console.error("Unexpected response format");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching recent activity:", error);
    //     }
    // };
    
    // const fetchStats = async (username, token) => {
    //     try {
    //         const response = await fetch(`https://estate-dj0k.onrender.com/api/stats/${username}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    
    //         // Check if the response is in JSON format
    //         const contentType = response.headers.get('content-type');
    //         if (contentType && contentType.includes('application/json')) {
    //             const data = await response.json();
    //             if (response.ok) {
    //                 setStats(data);
    //             } else {
    //                 console.error("Failed to fetch stats:", data.error);
    //             }
    //         } else {
    //             console.error("Unexpected response format:", await response.text());
    //         }
    //     } catch (error) {
    //         console.error("Error fetching stats:", error);
    //     }
    // };
    
    

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/Login");
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <div className="admin-contents">
                    <h2>Welcome, {username}!</h2>
                </div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Admindb">My Account</Link></li>
                    <li><Link to={`/Choosesale`}>Submit Property</Link></li>
                    <li><Link to={`/Added`}>Property Listings</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>
            <div className="admin-content">
                <div className="profile-details">
                    <h2>Profile Details</h2>
                    <img src={logo} alt="logo" width={70} height={90} />
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>User Type:</strong> {profile.userType}</p>
                </div>
                {/* <div className="dashboard-section">
                    <h2>Recent Activity</h2>
                    <ul>
                        {recentActivity.map((activity, index) => (
                            <li key={index}>{activity.description}</li>
                        ))}
                    </ul>
                </div> */}
                {/* <div className="dashboard-section">
                    <h2>Statistics</h2>
                    <p><strong>Total Properties Listed:</strong> {stats.totalProperties}</p>
                    <p><strong>Properties Sold/Rented:</strong> {stats.propertiesSoldOrRented}</p>
                    <p><strong>Active Listings:</strong> {stats.activeListings}</p>
                </div> */}
                <div className="dashboard-section">
                    <h2>User Tips</h2>
                    <p>Tip 1: Make sure to provide accurate details for your property listings.</p>
                    <p>Tip 2: Regularly update your listings to keep them relevant.</p>
                </div>
                <div className="dashboard-section">
                    <h2>Notifications</h2>
                    <ul>
                        <li>No new notifications</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
