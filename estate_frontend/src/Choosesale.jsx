import React,{useState,useEffect} from "react";
import { Link ,useLocation,useNavigate} from 'react-router-dom';
import './Choosesale.css';
import logo from '/src/estate.png';

export const ChooseBar = () => {
    const location = useLocation();
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const token = location?.state?.token;
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            console.log("invalid username");
        }
    }, [navigate]);
    const handleLogout = () => {
        // Clear local storage and redirect to login/signup page
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/Login");
    };
return(
    <div className="admin-dashboard">
            <nav className="admin-nav">
                <div className="admin-contents">
                    <h2>Welcome {username}!</h2>
                </div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Admindb">My Account</Link></li>
                    <li><Link to="/Choosesale">Submit Property</Link></li>
                    <li><Link to="/Added">Property Listings</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>
        
    <div className="property-buttons-container">
        <div className="sell">
        <ul>
        <li>Post your property for FREE today!</li>
        <li>Unlock your property's potential effortlessly.</li>
        <li>Showcase to a vast audience of eager buyers.</li>
        <li>Facilitate direct buyer contact for a streamlined sale.</li>
        </ul>
            <p><Link to={{ pathname: "/Listings", state: { token: token } }}><button className="property-button"><img src={logo} alt="logo" width={50} height={50}></img>Sale Property</button></Link></p>
        </div>
        <div className="rent">
        <ul><li>List your property for FREE and start renting today!</li>
        <li>Receive instant inquiries from potential tenants.</li>
        <li>Showcase your rental property to eager renters.</li>
        <li>Connect directly with interested renters hassle-free.</li></ul>
            <p><Link to={{ pathname: "/Rent", state: { token : token } }}><button className="property-button"><img src={logo} alt="logo" width={50} height={50}></img>Rent Property</button></Link></p>
        </div>
    </div>
    </div>
)};
export default ChooseBar;