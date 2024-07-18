import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./ADashboard.css";
import "./Rent.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const RentBar = () => {
    const username = localStorage.getItem("username");
    const location = useLocation();
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);


    const handleLogout = () => {
        // Clear local storage and redirect to login/signup page
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/Login");
    };

    const [rentform, setrentform] = useState({
        propertyType: "",
        buildingType: "",
        location: "",
        landmark: "",
        streetName: "",
        areaOccupied: "",
        monthlyRent: "",
        securityDeposit: "",
        ageOfProperty: "",
        parkingOption: "Yes",
        PhoneNumber: "",
        images: [], // Array to store uploaded image URLs
    });



    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setrentform({ ...rentform, [name]: value });
    };

    useEffect(() => {
        const userToken = location.state?.token || localStorage.getItem('token');
        if (userToken) {
          setToken(userToken);
          localStorage.setItem('token', userToken);
        }
      }, [location.state]);


    const handleImageUpload = async (e) => {
        const files = e.target.files; 
        const formData = new FormData();
        
        for (let i = 0; i < files.length; i++) {
          formData.append('image', files[i]);
        }
        
        setUploading(true); // Set uploading to true before starting the upload
        
        try {
          const response = await fetch('https://estate-dj0k.onrender.com/upload-image', {
            method: 'POST',
            body: formData,
            // No need to set 'Content-Type' for FormData
          });
        
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        
          const data = await response.json();
          // Append the newly uploaded image URLs to the existing images state
          setImages([...images, ...data.urls]);
          console.log('Images uploaded successfully:', data.urls);
        } catch (error) {
          console.error('Error uploading images:', error);
        } finally {
          setUploading(false); // Set uploading back to false after the upload is completed or if an error occurs
        }
      };
      


      const handleSubmit = async (event) => {
        event.preventDefault();
        if (!token) {
          setError("User not authenticated. Please log in.");
          toast.error("User not authenticated. Please log in.");
          return;
        }
      
        const detailsWithImages = { ...rentform, images };
      
        try {
          const response = await fetch(`https://estate-dj0k.onrender.com/rentals`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(detailsWithImages)
          });
      
          const data = await response.json();
          if (response.ok) {
            toast.success("Property added successfully!");
            setError(null);
          } else {
            setError(data.error || "Failed to create listing. Please try again later.");
            toast.error(data.error || "Failed to create listing. Please try again later.");
          }
        } catch (error) {
          console.error("Error submitting rental details:", error);
          toast.error("Failed to create listing. Please try again later.");
        }
      };
      

    return (
        <div className="rent-bar">
            <ToastContainer />
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
            <h1 style={{color:"white"}}>Rent Your Property</h1>
            <form onSubmit={handleSubmit}>
                {/* Form Inputs */}
                <label htmlFor="propertyType">Property Type:</label>
                <select
                    id="propertyType"
                    name="propertyType"
                    value={rentform.propertyType}
                    onChange={handleInputChange}
                >
                    <option value="">Select Property Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                </select>

                {rentform.propertyType === "residential" && (
                    <>
                        <label htmlFor="buildingType">Building Type:</label>
                        <select
                            id="buildingType"
                            name="buildingType"
                            value={rentform.buildingType}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Building Type</option>
                            <option value="co-living spaces">Co-Living Spaces</option>
                            <option value="apartment">Apartment</option>
                            <option value="villa">Villa</option>
                        </select>
                    </>
                )}

                {rentform.propertyType === "commercial" && (
                    <>
                        <label htmlFor="buildingType">Building Type:</label>
                        <select
                            id="buildingType"
                            name="buildingType"
                            value={rentform.buildingType}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Building Type</option>
                            <option value="commercial land">Commercial Land</option>
                            <option value="showrooms">Showrooms</option>
                            <option value="warehouse">Warehouse</option>
                            <option value="industries">Industries</option>
                        </select>
                    </>
                )}

                <label htmlFor="location">Location Detail:</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={rentform.location}
                    onChange={handleInputChange}
                />

                <label htmlFor="landmark">Landmark:</label>
                <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={rentform.landmark}
                    onChange={handleInputChange}
                />

                <label htmlFor="streetName">Street Name:</label>
                <input
                    type="text"
                    id="streetName"
                    name="streetName"
                    value={rentform.streetName}
                    onChange={handleInputChange}
                />

                <label htmlFor="areaOccupied">Area Occupied (in sqft):</label>
                <input
                    type="number"
                    id="areaOccupied"
                    name="areaOccupied"
                    min="0"
                    value={rentform.areaOccupied}
                    onChange={handleInputChange}
                />

                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                    type="tel"
                    id="PhoneNumber"
                    name="PhoneNumber"
                    value={rentform.PhoneNumber}
                    onChange={handleInputChange}
                />

                <label htmlFor="monthlyRent">Monthly Rent:</label>
                <input
                    type="number"
                    id="monthlyRent"
                    name="monthlyRent"
                    min="0"
                    value={rentform.monthlyRent}
                    onChange={handleInputChange}
                />

                <label htmlFor="securityDeposit">Advance / Security Deposit:</label>
                <input
                    type="number"
                    id="securityDeposit"
                    name="securityDeposit"
                    min="0"
                    value={rentform.securityDeposit}
                    onChange={handleInputChange}
                />

                <label htmlFor="ageOfProperty">Age of the Property:</label>
                <input
                    type="number"
                    id="ageOfProperty"
                    name="ageOfProperty"
                    min="0"
                    value={rentform.ageOfProperty}
                    onChange={handleInputChange}
                />

                <div>
                    <label>Parking Option:</label>
                    <input
                        type="radio"
                        id="parkingOptionYes"
                        name="parkingOption"
                        value="Yes"
                        checked={rentform.parkingOption === "Yes"}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="parkingOptionYes">Yes</label>
                    <input
                        type="radio"
                        id="parkingOptionNo"
                        name="parkingOption"
                        value="No"
                        checked={rentform.parkingOption === "No"}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="parkingOption">No</label>
                </div>

          <label htmlFor="images">Images:</label>
            <input type="file" multiple onChange={handleImageUpload} />
            <div>
              {images.map((url, index) => (
                <img key={index} src={url} alt={`Uploaded ${index}`} width="200" />
              ))}
            </div>

                <button type="submit" disabled={uploading}>Submit</button>
            </form>
        </div>
    );
};

export default RentBar;

