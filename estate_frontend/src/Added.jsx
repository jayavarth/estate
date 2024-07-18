import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight,faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import "./Added.css";

const PropertyModal = ({ listing, onClose,selectedListingId,token,setError }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % listing.images.length);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + listing.images.length) % listing.images.length
        );
    };

    const handleRemove = async (selectedListingId, setError) => {
        try {
            const response = await fetch(`https://estate-dj0k.onrender.com/remove_listing/${selectedListingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                // Handle successful removal
                onClose(); // Close the modal
            } else {
                const data = await response.json();
                setError(data.error || "Failed to delete property.");
                console.log(token);
            }
        } catch (error) {
            console.error("Error deleting property:", error);
            setError("Failed to delete property. Please try again later.");
        }
    };
    
    
    

    return (
        <div className="property-modal">
            <div className="modal-content">
                <span className="property-details">
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
                    <button onClick={() => handleRemove(selectedListingId,setError)} style={{ height:"100%" }}>
    <FontAwesomeIcon icon={faTrashAlt} />
</button>
<p style={{color:"blue"}}>Delete property details</p>
                    <button onClick={onClose} style={{position:"fixed",top:"5px",right:"20px",backgroundColor:"grey",color:"white"}}><FontAwesomeIcon icon={faTimes} /></button>
                </span>
                <span className="image-details">
    <div className="expand-images" style={{ height: "80%" }}>
        <img src={listing.images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} />
    </div>
    <div className="image-pagination">
    {listing.images.length > 1 && (
        <>
            <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrev} className="icon" style={{ marginRight: '240px' }} />
            <FontAwesomeIcon icon={faChevronRight} onClick={handleNext} className="icon" style={{ marginLeft: '100px' }} />
        </>
    )}
</div>

</span>

            </div>
        </div>
    );
};

const RentalPropertyModal = ({ rental, onClose,selectedRentalId, token, setError }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % rental.images.length);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + rental.images.length) % rental.images.length
        );
    };
    const handleRemoveRent = async (selectedRentalId,setError) => {
        try {
            const response = await fetch(`https://estate-dj0k.onrender.com/remove_rental/${selectedRentalId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setRentalListings(prevRentals => prevRentals.filter(item => item._id !== rental._id));
                onClose();
            } else {
                const data = await response.json();
                setError(data.error || "Failed to delete rental.");
            }
        } catch (error) {
            console.error("Error deleting rental:", error);
            setError("Failed to delete rental. Please try again later.");
        }
    };

    return (
        <div className="property-modal">
            <div className="modal-content">
            <span className="property-details">
                <p><strong>Property Type:</strong> {rental.propertyType}</p>
                <p><strong>Building Type:</strong> {rental.buildingType}</p>
                <p><strong>Location:</strong> {rental.location}</p>
                <p><strong>Street Name:</strong> {rental.streetName}</p>
                <p><strong>Area Occupied:</strong> {rental.areaOccupied}</p>
                <p><strong>Phone Number:</strong> {rental.phoneNumber}</p>
                <p><strong>Monthly Rent:</strong> {rental.monthlyRent}</p>
                <p><strong>Security Deposit:</strong> {rental.securityDeposit}</p>
                <p><strong>Age of Property:</strong> {rental.ageOfProperty}</p>
                <p><strong>Parking Option:</strong> {rental.parkingOption}</p>
                <button onClick={() => handleRemoveRent(selectedRentalId,setError)} style={{ height:"100%" }}>
    <FontAwesomeIcon icon={faTrashAlt} /></button>
    <p style={{color:"blue"}}>Delete property details</p>
                    <button onClick={onClose} style={{position:"fixed",top:"5px",right:"20px",backgroundColor:"grey",color:"white"}}><FontAwesomeIcon icon={faTimes} /></button>
                </span>
                <span className="image-details">
    <div className="expand-images" style={{ height: "80%" }}>
        <img src={rental.images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} />
    </div>
    <div className="image-pagination">
    {rental.images.length > 1 && (
        <>
            <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrev} className="icon" style={{ marginRight: '240px' }} />
            <FontAwesomeIcon icon={faChevronRight} onClick={handleNext} className="icon" style={{ marginLeft: '100px' }} />
        </>
    )}
</div>

</span>
            </div>
        </div>
    );
};

export const AddedBar = () => {
    const [listings, setListings] = useState([]);
    const [rentals, setRentalListings] = useState([]);
    const location = useLocation();
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState("");
    const [selectedListing, setSelectedListing] = useState(null);
    const navigate = useNavigate();
    const [selectedRental, setSelectedRental] = useState(null);
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [selectedRentalId, setSelectedRentalId] = useState(null);


    const openRentalPropertyModal = (index,RentalId) => {
        setSelectedRental(rentals[index]);
        setSelectedRentalId(RentalId);
    };

    const closeRentalPropertyModal = () => {
        setSelectedRental(null);
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            navigate("/SignBar"); // Redirect to login/signup if username not found
        }
    }, [navigate]);

    const handleLogout = () => {
        // Clear local storage and redirect to login/signup page
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/Login");
    };

    useEffect(() => {
        const userToken = location.state?.token || localStorage.getItem('token');
        if (userToken) {
            setToken(userToken);
            localStorage.setItem('token', userToken);
        }
    }, [location.state]);

    useEffect(() => {
        if (token) {
            fetchListings();
            fetchRentalListings();
        }
    }, [token]);

    const openPropertyModal = (index, listingId) => {
        setSelectedListing(listings[index]);
        setSelectedListingId(listingId); // Store the listing ID
    };
    

    const closePropertyModal = () => {
        setSelectedListing(null);
    };

    const fetchListings = async () => {
        if (!token) {
            setError("User not authenticated. Please log in.");
            return;
        }
        try {
            const response = await fetch(`https://estate-dj0k.onrender.com/added-listings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (response.ok) {
                setListings(data);
            } else {
                if (response.status === 401) {
                    handleUnauthorized();
                } else {
                    setError(data.error || "Failed to fetch listings.");
                }
            }
        } catch (error) {
            console.error("Error fetching listings:", error);
            setError("Failed to fetch listings. Please try again later.");
        }
    };

    const fetchRentalListings = async () => {
        if (!token) {
            setError("User not authenticated. Please log in.");
            return;
        }
        try {
            const response = await fetch(`https://estate-dj0k.onrender.com/added-rentals`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (response.ok) {
                setRentalListings(data);
            } else {
                if (response.status === 401) {
                    handleUnauthorized();
                } else {
                    setError(data.error || "Failed to fetch rentals.");
                }
            }
        } catch (error) {
            console.error("Error fetching rentals:", error);
            setError("Failed to fetch rentals. Please try again later.");
        }
    };

    const handleUnauthorized = () => {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/SignBar");
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <div className="admin-contents">
                    <h2>Welcome {username}!</h2>
                </div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Admindb">My Account</Link></li>
                    <li><Link to="/choosesale">Submit Property</Link></li>
                    <li><Link to="/Added">Property Listings</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>
            <div className="added-listings">
                <h2>Added Properties</h2>
                {error && <div className="error">{error}</div>}
                <div className="listing-grid">
                {listings.map((listing, index) => (
    <div key={index} className="added-item" onClick={() => openPropertyModal(index, listing._id)}>
        <p><strong>Owner Type:</strong> {listing.ownerType}</p>
        <p><strong>Phone Number:</strong> {listing.phoneNumber}</p>
        <p><strong>Location:</strong> {listing.location}</p>
        <div className="images">
            {listing.images.slice(0, 1).map((image, idx) => (
                <img key={idx} src={image} alt={`Image ${idx + 1}`} />
            ))}
            {listing.images.length > 1 && (
                <span className="more-images">Few more images</span>
            )}
        </div>
        <b style={{ color: "#398ce4" }}>Explore all details, or remove click here.</b>
    </div>
))}

                </div>
            </div><br />

            <div className="added-listings">
                <h2>Rental Properties</h2>
                {error && <div className="error">{error}</div>}
                <div className="listing-grid">
                    {rentals.map((rental, index) => (
                        <div key={index} className="added-item" onClick={() => openRentalPropertyModal(index,rental._id)}>
                            <p><strong>Owner Type:</strong> {rental.propertyType}</p>
                            <p><strong>Phone Number:</strong> {rental.PhoneNumber}</p>
                            <p><strong>Location:</strong> {rental.location}</p>
                            <div className="images">
                            {rental.images && rental.images.slice(0, 1).map((image, idx) => (
    <img key={idx} src={image} alt={`Image ${idx + 1}`} />
))}
{rental.images && rental.images.length > 1 && (
    <span className="more-images">Few more images</span>
)}

        </div>
                            <b style={{ color: "#398ce4" }}>Explore all details, or remove click here.</b>
                        </div>
                    ))}
                </div>
            </div>
            {selectedListing && <PropertyModal listing={selectedListing} onClose={closePropertyModal} selectedListingId={selectedListingId} token={token} setError={setError}/>}
            {selectedRental && <RentalPropertyModal rental={selectedRental} onClose={closeRentalPropertyModal} selectedRentalId={selectedRentalId} token={token} setError={setError} setRentalListings={setRentalListings} />}
        </div>
    );
};

export default AddedBar;
