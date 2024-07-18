import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import "./WishList.css";

export const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://estate-dj0k.onrender.com/wishlist?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.statusText}`);
      }

      const data = await response.json();
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Failed to fetch wishlist');
    }
  };


  return (
    <div className="wishlist-container">
      <h2>Wishlist</h2>
      {error && <div className="error">{error}</div>}
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlistItems.map((item, index) => (
            <li key={index}>
              {item.listing && (
                <div>
                  <p><strong>Property Type:</strong> {item.listing.propertyType}</p>
                  <p><strong>Location:</strong> {item.listing.location}</p>
                  <p><strong>Cost:</strong> {item.listing.cost}</p>
                  <p><strong>Phone Number:</strong> {item.listing.PhoneNumber}</p>
                  <div className="images">
                      {item.listing.images.slice(0, 1).map((image, idx) => (
                        <img key={idx} src={image} alt={`Image ${idx + 1}`} />
                      ))}
                      {item.listing.images.length > 1 && (
                        <span className="more-images">Few more images</span>
                      )}
                    </div>
                </div>
              )}
              {item.rental && (
                <div>
                  <p><strong>Property type:</strong> {item.rental.propertyType}</p>
                  <p><strong>Location:</strong> {item.rental.location}</p>
                  <p><strong>Monthly Rent:</strong> {item.rental.monthlyRent}</p>
                  <p><strong>Phone Number:</strong> {item.rental.PhoneNumber}</p>
                  <div className="images">
                      {item.rental.images.slice(0, 1).map((image, idx) => (
                        <img key={idx} src={image} alt={`Image ${idx + 1}`} />
                      ))}
                      {item.rental.images.length > 1 && (
                        <span className="more-images">Few more images</span>
                      )}
                    </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link to="/Client">Go back to Home</Link>
    </div>
  );
};

export default WishList;
