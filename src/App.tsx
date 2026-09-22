import React, { useState } from 'react';
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

// US Airports for Departure
const usAirports = [
  { code: 'JFK', name: 'New York (JFK) - USA' },
  { code: 'LAX', name: 'Los Angeles (LAX) - USA' },
  { code: 'ORD', name: 'Chicago (ORD) - USA' },
  { code: 'MIA', name: 'Miami (MIA) - USA' },
  { code: 'SFO', name: 'San Francisco (SFO) - USA' },
  { code: 'DFW', name: 'Dallas (DFW) - USA' },
  { code: 'BOS', name: 'Boston (BOS) - USA' },
  { code: 'LAS', name: 'Las Vegas (LAS) - USA' }
];

// International & Destination Airports
const destinationAirports = [
  { code: 'ISB', name: 'Islamabad (ISB) - Pakistan' },
  { code: 'LHE', name: 'Lahore (LHE) - Pakistan' },
  { code: 'DXB', name: 'Dubai (DXB) - UAE' },
  { code: 'LHR', name: 'London (LHR) - UK' },
  { code: 'YYZ', name: 'Toronto (YYZ) - Canada' },
  { code: 'JFK', name: 'New York (JFK) - USA' },
  { code: 'LAX', name: 'Los Angeles (LAX) - USA' },
  { code: 'ORD', name: 'Chicago (ORD) - USA' }
];

function App() {
  const [view, setView] = useState<'login' | 'signup' | 'user-home' | 'admin-dashboard'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Admin Password Change States
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [adminPassMsg, setAdminPassMsg] = useState('');
  const [adminPassError, setAdminPassError] = useState('');

  const [formData, setFormData] = useState<BookingFormData>({
    from_city: 'New York (JFK) - USA',
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

  // Searchable Dropdown States
  const [fromSearch, setFromSearch] = useState('New York (JFK) - USA');
  const [showFromList, setShowFromList] = useState(false);

  const [toSearch, setToSearch] = useState('');
  const [showToList, setShowToList] = useState(false);

  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);

  // Handle Login
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

  // Handle Signup
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

  // Handle Admin Password Change
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

  // Fetch Bookings for Admin
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

  // 1. LOGIN SCREEN
  if (view === 'login') {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <img src="/logo.png" alt="Meer Travels Logo" className="nav-logo" style={{ margin: '0 auto 15px auto', display: 'block', height: '60px' }} />
          <h2>Meer International</h2>
          <p>Login to your account</p>
         <form onSubmit={handleLogin}>
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              autoComplete="username"
              required 
            />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="current-password"
              required 
            />
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

  // 2. SIGNUP SCREEN
  if (view === 'signup') {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <img src="/logo.png" alt="Meer Travels Logo" className="nav-logo" style={{ margin: '0 auto 15px auto', display: 'block', height: '60px' }} />
          <h2>Meer International</h2>
          <p>Create a new user account</p>
          <form onSubmit={handleSignup}>
            <input type="text" placeholder="Choose Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type={showPassword ? "text" : "password"} placeholder="Choose Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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

  // 3. ADMIN DASHBOARD SCREEN
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

  // 4. USER HOMEPAGE & BOOKING SCREEN (Matching your CSS layouts)
  return (
    <div className="travel-app">
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="nav-logo" />
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0b192c', marginLeft: '10px' }}>Meer International</span>
        </div>
        
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#destinations">Destinations</a></li>
          <li><a href="#features">Services</a></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0b192c' }}>Hi, {username}</span>
          <button onClick={logout} className="logout-btn-nav">Logout</button>
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
                  placeholder="Search US airport..." 
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
                    {usAirports
                      .filter(a => a.name.toLowerCase().includes(fromSearch.toLowerCase()))
                      .map(airport => (
                        <li 
                          key={airport.code} 
                          onClick={() => {
                            setFromSearch(airport.name);
                            setFormData({ ...formData, from_city: airport.name });
                            setShowFromList(false);
                          }}
                        >
                          {airport.name}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <label>Flying To *</label>
                <input 
                  type="text" 
                  placeholder="Search destination airport..." 
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
                    {destinationAirports
                      .filter(a => a.name.toLowerCase().includes(toSearch.toLowerCase()))
                      .map(airport => (
                        <li 
                          key={airport.code} 
                          onClick={() => {
                            setToSearch(airport.name);
                            setFormData({ ...formData, to_city: airport.name });
                            setShowToList(false);
                          }}
                        >
                          {airport.name}
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
                <h2>✈ Booking Confirmed!</h2>
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

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="feature-box">
            <div className="feature-icon">✈</div>
            <h3>Best Flight Deals</h3>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🛡</div>
            <h3>Secure Booking</h3>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🌍</div>
            <h3>Global Destinations</h3>
          </div>
          <div className="feature-box">
            <div className="feature-icon">💬</div>
            <h3>24/7 Support</h3>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section id="destinations" className="destinations-section">
        <div className="destinations-container">
          <span className="destinations-subtitle">Explore Top Places</span>
          <h2>Popular Destinations</h2>
          <div className="destinations-grid">
            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34" alt="Paris" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i>★</i><i>★</i><i>★</i><i>★</i><i>★</i><span>(4.9)</span>
                </div>
                <h3>Paris, France</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c" alt="Dubai" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i>★</i><i>★</i><i>★</i><i>★</i><i>★</i><span>(4.8)</span>
                </div>
                <h3>Dubai, UAE</h3>
              </div>
            </div>

            <div className="destination-card">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1534430480872-3498386e7856" alt="New York" />
              </div>
              <div className="card-content">
                <div className="rating">
                  <i>★</i><i>★</i><i>★</i><i>★</i><i>★</i><span>(4.9)</span>
                </div>
                <h3>New York, USA</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Meer International Travels. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;