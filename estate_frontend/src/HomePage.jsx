import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/src/estate.png';
import './HomePage.css';

export const HomePage = () => {
  const [bhk, setBHK] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [listingType, setListingType] = useState('');
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      let query = new URLSearchParams();
      if (bhk) query.append('bhk', bhk);
      if (location) query.append('location', location);
      if (propertyType) query.append('propertyType', propertyType);
      if (listingType) query.append('listingType', listingType);

      const response = await fetch(`https://estate-dj0k.onrender.com/search-listings?${query.toString()}`);
      if (response.ok) {
        const searchData = await response.json();
        setListings(searchData);
      } else {
        throw new Error('Failed to fetch search results');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="img">
            <img src={logo} alt="logo" width={50} height={50} />
          </div>
          <ul className="navbar-menu">
            <li className="navbar-item"><Link to="/" className="navbar-link">Home</Link></li>
            <li className="navbar-item"><Link to="/Login" className="navbar-link">Login</Link></li>
            <li className="navbar-item"><Link to="/SignBar" className="navbar-link">Signup</Link></li>
          </ul>
        </div>
      </nav>
      <header className="header">
        <h1>Welcome to Real Estate Listings</h1>
        <p>Find your dream property here</p>
      </header>
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
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">Select Property Type</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa/House</option>
          <option value="commercial">Commercial Site</option>
        </select>
        <select value={listingType} onChange={(e) => setListingType(e.target.value)}>
          <option value="">Select Listing Type</option>
          <option value="sale">Sale</option>
          <option value="rental">Rental</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <div className="error">{error}</div>}
      {listings.length > 0 && (
        <section className="listings-section">
          <h2>Search Results</h2>
          <div className="listing-grid">
            {listings.map((listing, index) => (
              <div key={index} className="listing-item">
                <img src={listing.images[0]} alt="Property" className="listing-image" />
                <div className="listing-details">
                  <p><strong>Location:</strong> {listing.location}</p>
                  {listingType === 'sale' && <p><strong>Cost:</strong> {listing.cost}</p>}
                  {listingType === 'rental' && <p><strong>Monthly Rent:</strong> {listing.monthlyRent}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="why-us">
        <h2>Why Choose Us?</h2>
        <div className="why-us-content">
          <div className="why-us-item">Quick, Convenient, and Easy to Use</div>
          <div className="why-us-item">Verified Listings</div>
          <div className="why-us-item">More Qualified Leads</div>
          <div className="why-us-item">Cost Effective</div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
