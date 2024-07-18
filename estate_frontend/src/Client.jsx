import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Client.css';

export const ClientBar = () => {
  const [bhk, setBHK] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");
  const [saleListings, setSaleListings] = useState([]);
  const [rentalListings, setRentalListings] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllListings();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } else {
      navigate("/SignBar");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Remove userId on logout
    navigate("/Login");
  };

  const fetchAllListings = async () => {
    try {
      const saleResponse = await fetch("https://estate-dj0k.onrender.com/all-listings");
      const rentalResponse = await fetch("https://estate-dj0k.onrender.com/all-rentals");

      if (!saleResponse.ok || !rentalResponse.ok) {
        throw new Error("Failed to fetch listings");
      }

      const saleData = await saleResponse.json();
      const rentalData = await rentalResponse.json();

      setSaleListings(saleData);
      setRentalListings(rentalData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = async () => {
    try {
      let query = new URLSearchParams();
      if (bhk) query.append("bhk", bhk);
      if (location) query.append("location", location);
      if (propertyType) query.append("propertyType", propertyType);
      if (listingType) query.append("listingType", listingType);

      const response = await fetch(`https://estate-dj0k.onrender.com/search-listings?${query.toString()}`);
      if (response.ok) {
        const searchData = await response.json();
        if (searchData.hasOwnProperty("saleListings") && searchData.hasOwnProperty("rentalListings")) {
          setSaleListings(searchData.saleListings);
          setRentalListings(searchData.rentalListings);
        } else {
          throw new Error('Invalid search results format');
        }
      } else {
        throw new Error('Failed to fetch search results');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const addToWishlist = async (listing, rental) => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`https://estate-dj0k.onrender.com/add-to-wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ listing, rental }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        alert("Added to wishlist successfully");
      } else {
        throw new Error(responseData.error || "Failed to add to wishlist");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  

  return (
    <div className="client-container">
      <nav className="admin-nav">
        <div className="admin">
          <h2>Welcome, {username}!</h2>
        </div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li>Manage Account</li>
          <li>
            <Link to={{ pathname: "/wishlist", state: { userId } }}>WishList</Link>
          </li>
          <li>Settings</li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
      <h2>Search Properties</h2>
      <div className="search-bar">
  <select value={bhk} onChange={(e) => setBHK(e.target.value)}>
    <option value="">Select BHK</option>
    <option value="1bhk">1 BHK</option>
    <option value="2bhk">2 BHK</option>
    <option value="3bhk">3 BHK</option>
  </select>
  <input
    type="text"
    placeholder="Enter Location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
  />
  <select
    value={propertyType}
    onChange={(e) => setPropertyType(e.target.value)}
  >
    <option value="">Select Property Type</option>
    <option value="apartment">Apartment</option>
    <option value="villa">Villa/House</option>
    <option value="commercial">Commercial Site</option>
  </select>
  <select
    value={listingType}
    onChange={(e) => setListingType(e.target.value)}
  >
    <option value="">Select Listing Type</option>
    <option value="sale">Sale</option>
    <option value="rental">Rental</option>
  </select>
  <button onClick={handleSearch}>Search</button>
</div>

      {error && <div className="error">{error}</div>}

      {(saleListings.length > 0 || listingType === 'sale' || listingType === '') && (
        <div className="listings">
          <h3>Sale Properties</h3>
          {saleListings.length > 0 ? (
            saleListings.map((listing, index) => (
              <div key={index} className="listing-item">
                <div className="listing-details">
                  <div className="details-left">
                    <h3>{listing.fullName}</h3>
                    <p><strong>Owner Type:</strong> {listing.ownerType}</p>
                    <p><strong>Phone number:</strong> {listing.phoneNumber}</p>
                    <p><strong>Location:</strong> {listing.location}</p>
                    <p><strong>Street Name:</strong> {listing.streetName}</p>
                    <p><strong>Sqft:</strong> {listing.sqft}</p>
                    <p><strong>Parking option:</strong> {listing.parkingOption}</p>
                    <p><strong>Cost:</strong> {listing.cost}</p>
                    <p><strong>Landmark:</strong> {listing.landmark}</p>
                    <p><strong>Age of the property:</strong> {listing.Age}</p>
                    <p><strong>Time to contact:</strong> {listing.timeToContact}</p>
                    <p><strong>Sale type:</strong> {listing.saleType}</p>
                    <p><strong>Building Type:</strong> {listing.buildingType}</p>
                    <p><strong>Property Type:</strong> {listing.propertyType}</p>
                  </div>
                  <div className="details-right">
                    <div className="images">
                      {listing.images.slice(0, 1).map((image, idx) => (
                        <img key={idx} src={image} alt={`Image ${idx + 1}`} />
                      ))}
                      {listing.images.length > 1 && (
                        <span className="more-images">Few more images</span>
                      )}
                    </div>
                    <button onClick={() => addToWishlist(listing, null)}>Add to Wishlist</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No sale properties available.</p>
          )}
        </div>
      )}

      {(rentalListings.length > 0 || listingType === 'rental' || listingType === '') && (
        <div className="listings">
          <h3>Rental Properties</h3>
          {rentalListings.length > 0 ? (
            rentalListings.map((listing, index) => (
              <div key={index} className="listing-item">
                <div className="listing-details">
                  <div className="details-left">
                    <h3>{listing.fullName}</h3>
                    <p><strong>Property Type:</strong> {listing.propertyType}</p>
                    <p><strong>Building Type:</strong> {listing.buildingType}</p>
                    <p><strong>Location:</strong> {listing.location}</p>
                    <p><strong>Street Name:</strong> {listing.streetName}</p>
                    <p><strong>Area Occupied:</strong> {listing.areaOccupied}</p>
                    <p><strong>Phone Number:</strong> {listing.phoneNumber}</p>
                    <p><strong>Monthly Rent:</strong> {listing.monthlyRent}</p>
                    <p><strong>Security Deposit:</strong> {listing.securityDeposit}</p>
                    <p><strong>Age of Property:</strong> {listing.ageOfProperty}</p>
                    <p><strong>Parking Option:</strong> {listing.parkingOption}</p>
                  </div>
                  <div className="details-right">
                    <div className="images">
                      {listing.images.slice(0, 1).map((image, idx) => (
                        <img key={idx} src={image} alt={`Image ${idx + 1}`} />
                      ))}
                      {listing.images.length > 1 && (
                        <span className="more-images">Few more images</span>
                      )}
                    </div>
                    <button onClick={() => addToWishlist(null, listing)}>Add to Wishlist</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No rental properties available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientBar;

