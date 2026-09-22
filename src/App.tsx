import React, { useState } from 'react';
import { 
  Plane, 
  ShieldCheck, 
  Globe, 
  Headphones, 
  Award, 
  Clock, 
  User, 
  Lock, 
  Star 
} from 'lucide-react';
import './App.css';

interface BookingFormData {
  from_city: string;
  to_city: string;
  departing_date: string;
  returning_date: string;
  cabin_class: string;
  adults: string;
  children: string;
  infants: string;
  name: string;
  email: string;
  phone: string;
}

interface ConfirmedBooking extends BookingFormData {
  bookingId: number;
}

interface BookingRecord {
  id: number;
  from_city: string;
  to_city: string;
  departing_date: string;
  returning_date: string;
  cabin_class: string;
  name: string;
  email: string;
  phone: string;
}

const flyingFromOptions = [
  "Changi Airport – Singapore",
  "Incheon International Airport – Seoul, South Korea",
  "Haneda Airport – Tokyo, Japan",
  "Hamad International Airport – Doha, Qatar",
  "Dubai International Airport – Dubai, UAE",
  "Hong Kong International Airport – Hong Kong",
  "Kuala Lumpur International Airport – Malaysia",
  "Suvarnabhumi Airport – Bangkok, Thailand",
  "Beijing Capital International Airport – Beijing, China",
  "Indira Gandhi International Airport – Delhi, India",
  "Heathrow Airport – London, United Kingdom",
  "Charles de Gaulle Airport – Paris, France",
  "Frankfurt Airport – Frankfurt, Germany",
  "Schiphol Airport – Amsterdam, Netherlands",
  "Istanbul Airport – Istanbul, Turkey",
  "John F. Kennedy International Airport (JFK) – New York, USA",
  "Los Angeles International Airport (LAX) – Los Angeles, USA",
  "Hartsfield-Jackson Atlanta International Airport – Atlanta, USA",
  "Toronto Pearson International Airport – Toronto, Canada",
  "Sydney Kingsford Smith Airport – Sydney, Australia"
];

const flyingToOptions = [
  "United States (USA)",
  "United Kingdom (UK)",
  "United Arab Emirates (UAE)",
  "Saudi Arabia",
  "India",
  "China",
  "Canada",
  "Germany",
  "France",
  "Qatar",
  "Singapore",
  "Turkey",
  "Japan",
  "Thailand",
  "Australia",
  "Malaysia",
  "Netherlands",
  "South Korea",
  "Italy",
  "Spain",
  "Oman",
  "Kuwait",
  "Bahrain",
  "Indonesia",
  "Switzerland",
  "Egypt",
  "South Africa",
  "Brazil",
  "Mexico"
];

function App() {
  const [view, setView] = useState<'login' | 'signup' | 'user-home' | 'admin-dashboard'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [adminPassMsg, setAdminPassMsg] = useState('');
  const [adminPassError, setAdminPassError] = useState('');

  const [formData, setFormData] = useState<BookingFormData>({
    from_city: 'Changi Airport – Singapore',
    to_city: '',
    departing_date: '',
    returning_date: '',
    cabin_class: 'Economy',
    adults: '1',
    children: '0',
    infants: '0',
    name: '',
    email: '',
    phone: ''
  });

  const [fromSearch, setFromSearch] = useState('Changi Airport – Singapore');
  const [showFromList, setShowFromList] = useState(false);

  const [toSearch, setToSearch] = useState('');
  const [showToList, setShowToList] = useState(false);

  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (username.trim() === 'admin' && password === 'admin123') {
      setView('admin-dashboard');
      fetchBookings();
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setView('user-home');
      } else {
        setAuthError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setAuthError('Server connection failed. Make sure server.js is running.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (username.trim() === 'admin') {
      setAuthError('Username "admin" is reserved.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccess('Sign up successful! Please login now.');
        setTimeout(() => {
          setView('login');
          setAuthSuccess('');
          setPassword('');
        }, 1500);
      } else {
        setAuthError(data.error || 'Signup failed');
      }
    } catch (err) {
      setAuthError('Server connection failed.');
    }
  };

  const handleAdminPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassMsg('');
    setAdminPassError('');

    try {
      const res = await fetch('http://localhost:5000/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentAdminPass, newPassword: newAdminPass })
      });
      const data = await res.json();
      if (res.ok) {
        setAdminPassMsg('Admin password changed successfully!');
        setCurrentAdminPass('');
        setNewAdminPass('');
      } else {
        setAdminPassError(data.error || 'Failed to change password');
      }
    } catch (err) {
      setAdminPassError('Server connection failed.');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings');
      const data = await res.json();
      if (res.ok) setAllBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setConfirmedBooking({ ...formData, bookingId: data.bookingId });
      } else {
        setErrorMessage('Error: ' + data.error);
      }
    } catch (err) {
      setErrorMessage('Failed to connect to the server.');
    }
  };

  const logout = () => {
    setUsername('');
    setPassword('');
    setConfirmedBooking(null);
    setView('login');
  };

  if (view === 'login') {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <img src="/logo.png" alt="Meer Travels Logo" className="nav-logo" style={{ margin: '0 auto 15px auto', display: 'block', height: '60px' }} />
          <h2>Meer International</h2>
          <p>Login to your account</p>
          <form onSubmit={handleLogin}>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                autoComplete="username"
                required 
              />
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete="current-password"
                required 
              />
            </div>
            <div className="show-pass-row">
              <label>
                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} /> Show Password
              </label>
            </div>
            <button type="submit" className="book-btn">Login</button>
          </form>
          {authError && <p className="error-msg">{authError}</p>}
          {authSuccess && <p className="success-msg">{authSuccess}</p>}
          <p className="switch-text">Don't have an account? <span onClick={() => { setView('signup'); setAuthError(''); setAuthSuccess(''); setPassword(''); }}>Sign up</span></p>
        </div>
      </div>
    );
  }

  if (view === 'signup') {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <img src="/logo.png" alt="Meer Travels Logo" className="nav-logo" style={{ margin: '0 auto 15px auto', display: 'block', height: '60px' }} />
          <h2>Meer International</h2>
          <p>Create a new user account</p>
          <form onSubmit={handleSignup}>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input type="text" placeholder="Choose Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input type={showPassword ? "text" : "password"} placeholder="Choose Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="show-pass-row">
              <label>
                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} /> Show Password
              </label>
            </div>
            <button type="submit" className="book-btn">Sign Up</button>
          </form>
          {authError && <p className="error-msg">{authError}</p>}
          {authSuccess && <p className="success-msg">{authSuccess}</p>}
          <p className="switch-text">Already have an account? <span onClick={() => { setView('login'); setAuthError(''); setAuthSuccess(''); setPassword(''); }}>Login</span></p>
        </div>
      </div>
    );
  }

  if (view === 'admin-dashboard') {
    return (
      <div className="travel-app">
        <nav className="navbar">
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="nav-logo" />
            <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0b192c', marginLeft: '10px' }}>Admin Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Logged in as <strong>Admin</strong></span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </nav>

        <div className="admin-container">
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
            <h3>Change Admin Password</h3>
            <form onSubmit={handleAdminPasswordChange} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
              <input 
                type="password" 
                placeholder="Current Password" 
                value={currentAdminPass} 
                onChange={(e) => setCurrentAdminPass(e.target.value)} 
                required 
                style={{ padding: '8px', flex: '1', minWidth: '200px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
              <input 
                type="password" 
                placeholder="New Password" 
                value={newAdminPass} 
                onChange={(e) => setNewAdminPass(e.target.value)} 
                required 
                style={{ padding: '8px', flex: '1', minWidth: '200px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
              <button type="submit" className="book-btn" style={{ padding: '8px 20px', width: 'auto' }}>Update Password</button>
            </form>
            {adminPassMsg && <p className="success-msg" style={{ marginTop: '10px' }}>{adminPassMsg}</p>}
            {adminPassError && <p className="error-msg" style={{ marginTop: '10px' }}>{adminPassError}</p>}
          </div>

          <h2>All Flight Bookings ({allBookings.length})</h2>
          {allBookings.length === 0 ? (
            <p>No bookings found yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Departing</th>
                  <th>Class</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>{b.name}</td>
                    <td>{b.email}</td>
                    <td>{b.phone}</td>
                    <td>{b.from_city}</td>
                    <td>{b.to_city}</td>
                    <td>{b.departing_date}</td>
                    <td>{b.cabin_class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="travel-app">
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="nav-logo" />
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0b192c', marginLeft: '10px' }}>Meer International</span>
        </div>
        
        <div className="nav-right-group">
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#features">Services</a></li>
            <li><a href="#destinations">Destinations</a></li>
          </ul>

          <div className="user-profile-nav">
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0b192c' }}>Hi, {username}</span>
            <button onClick={logout} className="logout-btn-nav">Logout</button>
          </div>
        </div>
      </nav>

      <header id="home" className="hero-section">
        <div className="hero-content">
          <h1>Explore <span>The World</span> With Us</h1>
          <p>Book your domestic and international flights securely with <span>Meer International Travels</span></p>
          
          {!confirmedBooking ? (
            <form className="search-form" onSubmit={handleSubmitBooking}>
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Flying From *</label>
                <input 
                  type="text" 
                  placeholder="Search departure airport..." 
                  value={fromSearch}
                  onChange={(e) => {
                    setFromSearch(e.target.value);
                    setShowFromList(true);
                  }}
                  onFocus={() => setShowFromList(true)}
                  required
                />
                {showFromList && (
                  <ul className="dropdown-search-list">
                    {flyingFromOptions
                      .filter(item => item.toLowerCase().includes(fromSearch.toLowerCase()))
                      .map((airport, index) => (
                        <li 
                          key={index} 
                          onClick={() => {
                            setFromSearch(airport);
                            setFormData({ ...formData, from_city: airport });
                            setShowFromList(false);
                          }}
                        >
                          {airport}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <label>Flying To *</label>
                <input 
                  type="text" 
                  placeholder="Search destination country..." 
                  value={toSearch}
                  onChange={(e) => {
                    setToSearch(e.target.value);
                    setShowToList(true);
                  }}
                  onFocus={() => setShowToList(true)}
                  required
                />
                {showToList && (
                  <ul className="dropdown-search-list">
                    {flyingToOptions
                      .filter(item => item.toLowerCase().includes(toSearch.toLowerCase()))
                      .map((country, index) => (
                        <li 
                          key={index} 
                          onClick={() => {
                            setToSearch(country);
                            setFormData({ ...formData, to_city: country });
                            setShowToList(false);
                          }}
                        >
                          {country}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Departing On *</label>
                <input type="date" name="departing_date" value={formData.departing_date} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Returning On *</label>
                <input type="date" name="returning_date" value={formData.returning_date} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Cabin Class *</label>
                <select name="cabin_class" value={formData.cabin_class} onChange={handleChange}>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First Class">First Class</option>
                </select>
              </div>

              <div className="form-group">
                <label>Adults</label>
                <select name="adults" value={formData.adults} onChange={handleChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="form-group">
                <label>Children</label>
                <select name="children" value={formData.children} onChange={handleChange}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                </select>
              </div>

              <div className="form-group">
                <label>Infants</label>
                <select name="infants" value={formData.infants} onChange={handleChange}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                </select>
              </div>

              <div className="form-group">
                <label>Passenger Name *</label>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="form-actions">
                <button type="submit" className="book-btn">BOOK FLIGHT NOW</button>
              </div>
            </form>
          ) : (
            <div className="ticket-slip">
              <div className="ticket-header">
                <h2><Plane size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Booking Confirmed!</h2>
                <p>Booking ID: #{confirmedBooking.bookingId}</p>
              </div>
              <div className="ticket-body" style={{ lineHeight: '1.8' }}>
                <p><strong>Passenger:</strong> {confirmedBooking.name}</p>
                <p><strong>Route:</strong> {confirmedBooking.from_city} ➔ {confirmedBooking.to_city}</p>
                <p><strong>Departing Date:</strong> {confirmedBooking.departing_date}</p>
                <p><strong>Returning Date:</strong> {confirmedBooking.returning_date}</p>
                <p><strong>Cabin Class:</strong> {confirmedBooking.cabin_class}</p>
                <p><strong>Contact Email:</strong> {confirmedBooking.email}</p>
              </div>
              <div className="ticket-footer" style={{ marginTop: '20px' }}>
                <button onClick={() => setConfirmedBooking(null)} className="book-btn">Book Another Flight</button>
              </div>
            </div>
          )}

          {errorMessage && <p className="error-msg">{errorMessage}</p>}
        </div>
      </header>

      <section id="features" className="features-section">
        <div className="features-container">
          <div className="feature-box">
            <div className="feature-icon"><Plane size={28} /></div>
            <h3>Best Flight Deals</h3>
            <p>Access competitive airfares across major global carriers.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon"><ShieldCheck size={28} /></div>
            <h3>Secure Booking</h3>
            <p>Your transactions and personal info are fully encrypted.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon"><Globe size={28} /></div>
            <h3>Global Destinations</h3>
            <p>Fly to thousands of destinations worldwide seamlessly.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon"><Headphones size={28} /></div>
            <h3>24/7 Support</h3>
            <p>Our support team is always ready to assist you anytime.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon"><Award size={28} /></div>
            <h3>Trusted Agency</h3>
            <p>Recognized for exceptional service quality and reliability.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon"><Clock size={28} /></div>
            <h3>Instant Confirmation</h3>
            <p>Receive your verifiable ticket slip right after booking.</p>
          </div>
        </div>
      </section>

      <section className="partner-section">
        <div className="partner-container">
          <div className="partner-content">
            <span className="destinations-subtitle">WHO WE ARE</span>
            <h2>Providing Unforgettable Travel Experiences Since 2015</h2>
            <p>
              At Meer International Travels, we specialize in offering comprehensive and seamless flight booking solutions. Whether you're planning a corporate retreat, a family holiday, or an international adventure, our dedicated team ensures your travel is smooth from takeoff to landing.
            </p>
            <ul className="partner-features-list">
              <li>✓ Trusted global airline partnerships</li>
              <li>✓ Transparent pricing with zero hidden fees</li>
              <li>✓ Dedicated customer service and guidance</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="destinations-section">
        <div className="destinations-container">
          <span className="destinations-subtitle">EXPLORE TOP PLACES</span>
          <h2>Popular Destinations</h2>
          <div className="destinations-grid">
            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34" alt="Paris, France" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>(4.9)</span>
                </div>
                <h3>Paris, France</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c" alt="Dubai, UAE" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>(4.8)</span>
                </div>
                <h3>Dubai, UAE</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9" alt="New York, USA" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>(4.9)</span>
                </div>
                <h3>New York, USA</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1533929736458-ca588d08c8be" alt="London, UK" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>(4.7)</span>
                </div>
                <h3>London, UK</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8" alt="Maldives" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>(5.0)</span>
                </div>
                <h3>Maldives</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4" alt="Switzerland" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>(4.9)</span>
                </div>
                <h3>Switzerland</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tourist-blog-section">
        <div className="tourist-blog-container">
          <h2 className="blog-title">Tourist Blog</h2>
          <div className="blog-grid">
            <div className="blog-card">
              <div className="blog-image-wrapper">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" alt="Traveling with kids" />
              </div>
              <div className="blog-content-box">
                <div className="blog-date-badge">
                  <span className="blog-day">24</span>
                  <span className="blog-month">Nov</span>
                </div>
                <div className="blog-text-content">
                  <span className="blog-category">| Traveling</span>
                  <h3>Tips For Taking A Long-Term Trip With Kids.</h3>
                  <a href="#read-more" className="read-more-link">READ MORE »</a>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image-wrapper">
                <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828" alt="Traveling tips" />
              </div>
              <div className="blog-content-box">
                <div className="blog-date-badge">
                  <span className="blog-day">24</span>
                  <span className="blog-month">Nov</span>
                </div>
                <div className="blog-text-content">
                  <span className="blog-category">| Traveling</span>
                  <h3>Tips For Taking A Long-Term Trip With Kids.</h3>
                  <a href="#read-more" className="read-more-link">READ MORE »</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col footer-brand">
            <img src="logo.png" alt="Travels Vista" className="footer-logo" />
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#destinations">Destinations</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Support</h3>
            <ul>
              <li><a href="#faq">Frequently Asked Questions</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#payment-issue">Report a Payment Issue</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright &copy; 2026 All rights reserved meertravel.co.uk</p>
        </div>
      </footer>
    </div>
  );
}

export default App;