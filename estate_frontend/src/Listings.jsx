import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Listings.css';

export const ListBar = () => {
  const username = localStorage.getItem("username");
  const location = useLocation();
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [adminDetails, setAdminDetails] = useState({
    ownerType: "",
    propertyType: "",
    buildingType: "",
    saleType: "",
    timeToContact: "",
    Age: "",
    phoneNumber: "",
    location: "",
    landmark: "",
    streetName: "",
    sqft: "",
    parkingOption: "Yes",
    images: [],
    cost: "",
  });


  useEffect(() => {
    const userToken = location.state?.token || localStorage.getItem('token');
    if (userToken) {
      setToken(userToken);
      localStorage.setItem('token', userToken);
    }
  }, [location.state]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdminDetails({ ...adminDetails, [name]: value });
  };

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
  
    const detailsWithImages = { ...adminDetails, images };
  
    try {
      const response = await fetch('https://estate-dj0k.onrender.com/listings', {
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
      console.error("Error submitting admin details:", error);
      setError("Failed to create listing. Please try again later.");
      toast.error("Failed to create listing. Please try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/Login");
};
  
  return (
    <div className="admin-listings">
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
      <h1 className="caption" style={{color:"white"}}>Unlock Your Property's Potential</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td><label htmlFor="ownerType">Owner Type:</label></td>
                <td>
                  <select id="ownerType" name="ownerType" value={adminDetails.ownerType} onChange={handleInputChange}>
                    <option value="">Select Owner Type</option>
                    <option value="dealer">Dealer</option>
                    <option value="owner">Owner</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><label htmlFor="propertyType">Property Type:</label></td>
                <td>
                  <select id="propertyType" name="propertyType" value={adminDetails.propertyType} onChange={handleInputChange}>
                    <option value="">Select Property Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa/House</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><label htmlFor="buildingType">Building Type:</label></td>
                <td>
                  <select
                    id="buildingType"
                    name="buildingType"
                    value={adminDetails.buildingType}
                    onChange={handleInputChange}
                    disabled={adminDetails.propertyType === "commercial"}
                  >
                    <option value="">Select Building Type</option>
                    {(adminDetails.propertyType === "apartment" || adminDetails.propertyType === "villa") && (
                      <>
                        <option value="1bhk">1 BHK</option>
                        <option value="2bhk">2 BHK</option>
                        <option value="3bhk">3 BHK</option>
                      </>
                    )}
                  </select>
                </td>
              </tr>
              <tr>
                <td><label htmlFor="saleType">Sale type:</label></td>
                <td>
                  <select id="saleType" name="saleType" value={adminDetails.saleType} onChange={handleInputChange}>
                    <option value="">Select Sale Type</option>
                    <option value="new">New</option>
                    <option value="resale">Resale</option>
                  </select>
                </td>
              </tr>
              <tr className={adminDetails.saleType === "resale" ? "" : "hidden"}>
                <td><label htmlFor="Age">Age of the property:</label></td>
                <td>
                  <input
                    type="number"
                    id="Age"
                    name="Age"
                    value={adminDetails.Age}
                    onChange={handleInputChange}
                    disabled={adminDetails.saleType !== "resale"}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="phoneNumber">Phone Number:</label></td>
                <td>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={adminDetails.phoneNumber}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="location">Location:</label></td>
                <td>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={adminDetails.location}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="landmark">Landmark:</label></td>
                <td>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={adminDetails.landmark}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="streetName">Street Name:</label></td>
                <td>
                  <input
                    type="text"
                    id="streetName"
                    name="streetName"
                    value={adminDetails.streetName}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="sqft">Area occupied (in sq ft):</label></td>
                <td>
                  <input
                    type="number"
                    id="sqft"
                    name="sqft"
                    value={adminDetails.sqft}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td><label>Parking Option:</label></td>
                <td>
                  <div className="radio-container">
                    <input
                      type="radio"
                      id="parkingOptionYes"
                      name="parkingOption"
                      value="Yes"
                      checked={adminDetails.parkingOption === "Yes"}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="parkingOptionYes">Yes</label>
                    <input
                      type="radio"
                      id="parkingOptionNo"
                      name="parkingOption"
                      value="No"
                      checked={adminDetails.parkingOption === "No"}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="parkingOptionNo">No</label>
                  </div>
                </td>
              </tr>
              <tr>
                                <td>
                                    <label htmlFor="timeToContact">Time to Contact:</label>
                                </td>
                                <td>
                                    <div className="time-container">
                                        <select
                                            id="timeToContact"
                                            name="timeToContact"
                                            value={adminDetails.timeToContact}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Time</option>
                                            <option value="00:00">12:00 AM</option>
                                            <option value="01:00">1:00 AM</option>
                                            <option value="02:00">2:00 AM</option>
                                            <option value="03:00">3:00 AM</option>
                                            <option value="04:00">4:00 AM</option>
                                            <option value="05:00">5:00 AM</option>
                                            <option value="06:00">6:00 AM</option>
                                            <option value="07:00">7:00 AM</option>
                                            <option value="08:00">8:00 PM</option>
                                            <option value="09:00">9:00 PM</option>
                                            <option value="10:00">10:00 PM</option>
                                            <option value="11:00">11:00 PM</option>
                                            <option value="12:00">12:00 AM</option>
                                            <option value="13:00">1:00 PM</option>
                                            <option value="14:00">2:00 PM</option>
                                            <option value="15:00">3:00 PM</option>
                                            <option value="16:00">4:00 PM</option>
                                            <option value="17:00">5:00 PM</option>
                                            <option value="18:00">6:00 PM</option>
                                            <option value="19:00">7:00 PM</option>
                                            <option value="20:00">8:00 PM</option>
                                            <option value="21:00">9:00 PM</option>
                                            <option value="22:00">10:00 PM</option>
                                            <option value="23:00">11:00 PM</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="cost">Cost:</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        id="cost"
                                        name="cost"
                                        value={adminDetails.cost}
                                        onChange={handleInputChange}
                                    />
                                </td>
                            </tr>
              <tr>
          <td><label htmlFor="images">Images:</label></td>
          <td>
            <input type="file" multiple onChange={handleImageUpload} />
            <div>
              {images.map((url, index) => (
                <img key={index} src={url} alt={`Uploaded ${index}`} width="200" />
              ))}
            </div>
          </td>
        </tr>
              <tr>
                <td colSpan="2" className="submit-container">
                  <button type="submit" className="submit-button" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Submit'}
                  </button>
                </td>
              </tr>
              {error && <tr><td colSpan="2" className="error">{error}</td></tr>}
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default ListBar;



