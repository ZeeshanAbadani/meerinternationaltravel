import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departingDate, setDepartingDate] = useState('');
  const [returningDate, setReturningDate] = useState('');
  const [travelClass, setTravelClass] = useState('economy');
  
  // Passenger states with 1-5 options and inline custom support
  const [adults, setAdults] = useState('1');
  const [customAdults, setCustomAdults] = useState('');
  const [childrenCount, setChildrenCount] = useState('0');
  const [customChildren, setCustomChildren] = useState('');
  const [infants, setInfants] = useState('0');
  const [customInfants, setCustomInfants] = useState('');

  // Customer Contact Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Flying From Airport List
  const airports = [
    'Changi Airport – Singapore',
    'Incheon International Airport – Seoul, South Korea',
    'Haneda Airport – Tokyo, Japan',
    'Hamad International Airport – Doha, Qatar',
    'Dubai International Airport – Dubai, UAE',
    'Hong Kong International Airport – Hong Kong',
    'Kuala Lumpur International Airport – Malaysia',
    'Suvarnabhumi Airport – Bangkok, Thailand',
    'Beijing Capital International Airport – Beijing, China',
    'Indira Gandhi International Airport – Delhi, India',
    'Heathrow Airport – London, United Kingdom',
    'Charles de Gaulle Airport – Paris, France',
    'Frankfurt Airport – Frankfurt, Germany',
    'Schiphol Airport – Amsterdam, Netherlands',
    'Istanbul Airport – Istanbul, Turkey',
    'John F. Kennedy International Airport (JFK) – New York, USA',
    'Los Angeles International Airport (LAX) – Los Angeles, USA',
    'Hartsfield-Jackson Atlanta International Airport – Atlanta, USA',
    'Toronto Pearson International Airport – Toronto, Canada',
    'Sydney Kingsford Smith Airport – Sydney, Australia'
  ];

  // Flying To Country List
  const countries = [
    'United States (USA)',
    'United Kingdom (UK)',
    'United Arab Emirates (UAE)',
    'Saudi Arabia',
    'India',
    'China',
    'Canada',
    'Germany',
    'France',
    'Qatar',
    'Singapore',
    'Turkey',
    'Japan',
    'Thailand',
    'Australia',
    'Malaysia',
    'Netherlands',
    'South Korea',
    'Italy',
    'Spain',
    'Oman',
    'Kuwait',
    'Bahrain',
    'Indonesia',
    'Switzerland',
    'Egypt',
    'South Africa',
    'Brazil',
    'Mexico'
  ];

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const filteredAirports = airports.filter(a => a.toLowerCase().includes(fromLocation.toLowerCase()));
  const filteredCountries = countries.filter(c => c.toLowerCase().includes(toLocation.toLowerCase()));

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromLocation || !toLocation || !departingDate || !customerName || !customerEmail || !customerPhone) {
      setErrorMsg('Please fill in all required fields marked with *.');
      setSuccessMsg('');
      return;
    }

    setErrorMsg('');
    const finalAdults = adults === 'custom' ? customAdults : adults;
    const finalChildren = childrenCount === 'custom' ? customChildren : childrenCount;
    const finalInfants = infants === 'custom' ? customInfants : infants;

    const bookingInfo = {
      id: 'MT-' + Math.floor(100000 + Math.random() * 900000),
      from: fromLocation,
      to: toLocation,
      departingDate,
      returningDate: returningDate || 'N/A',
      travelClass,
      passengers: `Adults: ${finalAdults}, Children: ${finalChildren}, Infants: ${finalInfants}`,
      customerName,
      customerEmail,
      customerPhone,
      bookedAt: new Date().toLocaleString()
    };

    setBookingDetails(bookingInfo);
    setSuccessMsg('Booking successful! Your ticket slip is generated below.');
  };

  return (
    <div className="travel-app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <h2 className="footer-logo-text" style={{ margin: 0, fontSize: '22px' }}>
            MEER<span>TRAVELS</span>
          </h2>
        </div>
        <div className="nav-right-group">
          <ul className="nav-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#destinations">Destinations</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section & Search Form */}
      <header id="hero" className="hero-section">
        <div className="hero-content" style={{ maxWidth: '950px' }}>
          <h1>Explore The World With <span>Meer Travels</span></h1>
          <p>Find the best flights, tours, and holiday packages at unbeatable prices.</p>

          <form className="search-form" onSubmit={handleBookingSubmit} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            
            {/* Flying From */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Flying From *</label>
              <input 
                type="text" 
                placeholder="Select Airport" 
                value={fromLocation} 
                onChange={(e) => { setFromLocation(e.target.value); setShowFromDropdown(true); }}
                onFocus={() => setShowFromDropdown(true)}
              />
              {showFromDropdown && (
                <ul className="dropdown-search-list" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #cbd5e1', zIndex: 10, maxHeight: '180px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
                  {filteredAirports.length > 0 ? (
                    filteredAirports.map((airport, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => { setFromLocation(airport); setShowFromDropdown(false); }}
                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#334155' }}
                      >
                        {airport}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: '8px 12px', fontSize: '13px', color: '#94a3b8' }}>No airport found</li>
                  )}
                </ul>
              )}
            </div>

            {/* Flying To */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Flying To *</label>
              <input 
                type="text" 
                placeholder="Select Country" 
                value={toLocation} 
                onChange={(e) => { setToLocation(e.target.value); setShowToDropdown(true); }}
                onFocus={() => setShowToDropdown(true)}
              />
              {showToDropdown && (
                <ul className="dropdown-search-list" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #cbd5e1', zIndex: 10, maxHeight: '180px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => { setToLocation(country); setShowToDropdown(false); }}
                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '13px', color: '#334155' }}
                      >
                        {country}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: '8px 12px', fontSize: '13px', color: '#94a3b8' }}>No country found</li>
                  )}
                </ul>
              )}
            </div>

            {/* Departing On */}
            <div className="form-group">
              <label>Departing On *</label>
              <input 
                type="date" 
                value={departingDate} 
                onChange={(e) => setDepartingDate(e.target.value)} 
              />
            </div>

            {/* Returning On */}
            <div className="form-group">
              <label>Returning On *</label>
              <input 
                type="date" 
                value={returningDate} 
                onChange={(e) => setReturningDate(e.target.value)} 
              />
            </div>

            {/* Cabin Class */}
            <div className="form-group">
              <label>Cabin Class *</label>
              <select value={travelClass} onChange={(e) => setTravelClass(e.target.value)}>
                <option value="economy">Economy</option>
                <option value="premium economy">Premium Economy</option>
                <option value="bussiness">Bussiness</option>
                <option value="first class">First Class</option>
              </select>
            </div>

            {/* Adults */}
            <div className="form-group">
              <label>Adults (12+ yrs)</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                <select value={adults} onChange={(e) => setAdults(e.target.value)} style={{ flex: adults === 'custom' ? '1' : '100%' }}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="custom">Custom Create</option>
                </select>
                {adults === 'custom' && (
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    value={customAdults} 
                    onChange={(e) => setCustomAdults(e.target.value)} 
                    style={{ width: '65px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                )}
              </div>
            </div>

            {/* Children */}
            <div className="form-group">
              <label>Children (2-12 yrs)</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                <select value={childrenCount} onChange={(e) => setChildrenCount(e.target.value)} style={{ flex: childrenCount === 'custom' ? '1' : '100%' }}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="custom">Custom Create</option>
                </select>
                {childrenCount === 'custom' && (
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    value={customChildren} 
                    onChange={(e) => setCustomChildren(e.target.value)} 
                    style={{ width: '65px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                )}
              </div>
            </div>

            {/* Infants */}
            <div className="form-group">
              <label>Infants (0-2 yrs)</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                <select value={infants} onChange={(e) => setInfants(e.target.value)} style={{ flex: infants === 'custom' ? '1' : '100%' }}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="custom">Custom Create</option>
                </select>
                {infants === 'custom' && (
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    value={customInfants} 
                    onChange={(e) => setCustomInfants(e.target.value)} 
                    style={{ width: '65px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                )}
              </div>
            </div>

            {/* Customer Name */}
            <div className="form-group">
              <label>Customer Name *</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
              />
            </div>

            {/* Customer Email */}
            <div className="form-group">
              <label>Customer Email *</label>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={customerEmail} 
                onChange={(e) => setCustomerEmail(e.target.value)} 
              />
            </div>

            {/* Customer Phone */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Customer Phone *</label>
              <input 
                type="text" 
                placeholder="Phone Number" 
                value={customerPhone} 
                onChange={(e) => setCustomerPhone(e.target.value)} 
              />
            </div>

            {/* Search Flights Button */}
            <div className="form-actions" style={{ gridColumn: 'span 4' }}>
              <button type="submit" className="book-btn">SEARCH FLIGHTS</button>
            </div>
          </form>

          {errorMsg && <div className="error-msg">{errorMsg}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}
        </div>
      </header>

      {/* Ticket Slip Confirmation */}
      {bookingDetails && (
        <section style={{ padding: '40px 20px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
          <div className="ticket-slip">
            <div className="ticket-header">
              <h2>E-Ticket Confirmation</h2>
              <p>Booking ID: {bookingDetails.id}</p>
            </div>
            <p><strong>Customer Name:</strong> {bookingDetails.customerName}</p>
            <p><strong>Email:</strong> {bookingDetails.customerEmail}</p>
            <p><strong>Phone:</strong> {bookingDetails.customerPhone}</p>
            <p><strong>Flying From:</strong> {bookingDetails.from}</p>
            <p><strong>Flying To:</strong> {bookingDetails.to}</p>
            <p><strong>Departing On:</strong> {bookingDetails.departingDate}</p>
            <p><strong>Returning On:</strong> {bookingDetails.returningDate}</p>
            <p><strong>Cabin Class:</strong> {bookingDetails.travelClass}</p>
            <p><strong>Passengers:</strong> {bookingDetails.passengers}</p>
            <p><strong>Booked At:</strong> {bookingDetails.bookedAt}</p>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="feature-box">
            <i className="fa-solid fa-globe feature-icon"></i>
            <h3>Worldwide Coverage</h3>
          </div>
          <div className="feature-box">
            <i className="fa-solid fa-tag feature-icon"></i>
            <h3>Competitive Pricing</h3>
          </div>
          <div className="feature-box">
            <i className="fa-solid fa-headset feature-icon"></i>
            <h3>24/7 Support</h3>
          </div>
          <div className="feature-box">
            <i className="fa-solid fa-shield-halved feature-icon"></i>
            <h3>Safe & Secure</h3>
          </div>
        </div>
      </section>

      {/* Partner / Who We Are Section */}
      <section className="partner-section">
        <div className="partner-container">
          <div className="partner-content">
            <h2>Who We Are</h2>
            <p>Meer Travels is your trusted travel partner, committed to making your journeys comfortable, memorable, and hassle-free across the globe.</p>
            <ul className="partner-features-list">
              <li><i className="fa-solid fa-check"></i> Best Price Guarantee</li>
              <li><i className="fa-solid fa-check"></i> Trusted Travel Agents</li>
              <li><i className="fa-solid fa-check"></i> Fast Booking Process</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section (9 Images) */}
      <section id="destinations" className="destinations-section">
        <div className="destinations-container">
          <span className="destinations-subtitle">Explore</span>
          <h2>Popular Destinations</h2>
          <div className="destinations-grid">
            
            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c" alt="Dubai" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  <span>4.9</span>
                </div>
                <h3>Dubai, UAE</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1541432901042-2d8bd64b3a9b" alt="Istanbul" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
                  <span>4.8</span>
                </div>
                <h3>Istanbul, Turkey</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad" alt="London" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  <span>5.0</span>
                </div>
                <h3>London, UK</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26" alt="Tokyo" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  <span>4.9</span>
                </div>
                <h3>Tokyo, Japan</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34" alt="Paris" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
                  <span>4.7</span>
                </div>
                <h3>Paris, France</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1533929736458-ca588d58c8be" alt="New York" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  <span>4.9</span>
                </div>
                <h3>New York, USA</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8" alt="Singapore" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  <span>5.0</span>
                </div>
                <h3>Singapore</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9" alt="Sydney" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
                  <span>4.8</span>
                </div>
                <h3>Sydney, Australia</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4" alt="Bangkok" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  <span>4.9</span>
                </div>
                <h3>Bangkok, Thailand</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tourist Blog Section */}
      <section id="blog" className="tourist-blog-section">
        <div className="tourist-blog-container">
          <h2 className="blog-title">Travel Articles & Blog</h2>
          <div className="blog-grid">
            <div className="blog-card">
              <div className="blog-image-wrapper">
                <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828" alt="Blog 1" />
              </div>
              <div className="blog-content-box">
                <div className="blog-date-badge">
                  <span className="blog-day">12</span>
                  <span className="blog-month">Sep</span>
                </div>
                <div className="blog-text-content">
                  <span className="blog-category">Tips & Tricks</span>
                  <h3>Top 10 Tips for Traveling on a Budget</h3>
                  <a href="#hero" className="read-more-link">Read More &rarr;</a>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image-wrapper">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" alt="Blog 2" />
              </div>
              <div className="blog-content-box">
                <div className="blog-date-badge">
                  <span className="blog-day">25</span>
                  <span className="blog-month">Aug</span>
                </div>
                <div className="blog-text-content">
                  <span className="blog-category">Destinations</span>
                  <h3>Discovering Hidden Beaches Around the World</h3>
                  <a href="#hero" className="read-more-link">Read More &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h2 className="footer-logo-text">MEER<span>TRAVELS</span></h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '10px' }}></p>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#destinations">Destinations</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul>
              <li><a href="#hero">Support: support@meertravels.com</a></li>
              <li><a href="#hero">Phone: +92 300 1234567</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Meer Travels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}