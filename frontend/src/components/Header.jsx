import { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiBell, FiCheckCircle, FiAlertCircle, FiShield, FiBriefcase, FiUser, FiPower } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { checkHealth } from '../services/api';

function Header({ title, subtitle }) {
  const { theme, toggleTheme } = useTheme();
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [role, setRole] = useState(localStorage.getItem("userRole") || "admin");
  const [isVendorOnline, setIsVendorOnline] = useState(
    localStorage.getItem("vendorStatus") !== "offline"
  );
  
  // User profile state
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "John Doe");
  const [gender, setGender] = useState(localStorage.getItem("userGender") || "Male");

  useEffect(() => {
    let isMounted = true;
    const verifyBackend = async () => {
      const status = await checkHealth();
      if (isMounted) setIsBackendOnline(status);
    };
    verifyBackend();
    const interval = setInterval(verifyBackend, 15000);

    const handleRoleChanged = () => {
      setRole(localStorage.getItem("userRole") || "admin");
      setUserName(
        localStorage.getItem("displayName") ||
        localStorage.getItem("userName") ||
        (localStorage.getItem("userRole") === "vendor" ? "Rahul Sharma" : "Mounish Sai")
      );
      setGender(localStorage.getItem("userGender") || "Male");
    };

    window.addEventListener("roleChanged", handleRoleChanged);
    window.addEventListener("storage", handleRoleChanged);
    window.addEventListener("profileUpdated", handleRoleChanged);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("roleChanged", handleRoleChanged);
      window.removeEventListener("storage", handleRoleChanged);
      window.removeEventListener("profileUpdated", handleRoleChanged);
    };
  }, []);

  const toggleVendorStatus = () => {
    const nextStatus = !isVendorOnline;
    setIsVendorOnline(nextStatus);
    localStorage.setItem("vendorStatus", nextStatus ? "online" : "offline");
    window.dispatchEvent(new Event("vendorStatusChanged"));
  };

  const isAdmin = role === "admin";
  const salutation = gender === "Female" ? "Mrs." : gender === "Male" ? "Mr." : "";
  const welcomeText = `Welcome ${salutation} ${userName}`.trim();

  const displayTitle = title || (isAdmin ? "Executive Admin Dashboard" : "Vendor Store Dashboard");
  const displaySubtitle = subtitle || `Greeting, ${welcomeText}`;

  return (
    <header className="top-header">
      <div>
        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: isAdmin ? "#2563EB" : "#10B981", marginBottom: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
          <FiUser /> {welcomeText}
        </div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.75rem', margin: 0 }}>
          {displayTitle}
          <span
            className="badge"
            style={{
              fontSize: '0.7rem',
              padding: '4px 10px',
              background: isAdmin ? 'rgba(37, 99, 235, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: isAdmin ? '#3B82F6' : '#10B981',
              border: `1px solid ${isAdmin ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
            }}
          >
            {isAdmin ? <FiShield /> : <FiBriefcase />}
            {isAdmin ? 'ADMIN MODE' : 'VENDOR MODE'}
          </span>
        </h1>
        <p style={{ marginTop: '2px' }}>{displaySubtitle}</p>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Vendor Online / Offline Status Button (Visible for Vendor) */}
        {!isAdmin && (
          <button
            onClick={toggleVendorStatus}
            className="btn"
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: isVendorOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isVendorOnline ? '#10B981' : '#EF4444',
              border: `1px solid ${isVendorOnline ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Click to toggle store Online / Offline status"
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isVendorOnline ? '#10B981' : '#EF4444',
                boxShadow: isVendorOnline ? '0 0 8px #10B981' : 'none'
              }}
            />
            <FiPower style={{ fontSize: '0.9rem' }} />
            <span>{isVendorOnline ? 'Vendor Online' : 'Vendor Offline'}</span>
          </button>
        )}

        {/* Backend Status Indicator */}
        <div 
          className={`badge ${isBackendOnline ? 'badge-success' : 'badge-warning'}`}
          title={isBackendOnline ? "FastAPI Backend is Online" : "Using Offline Fallback Mode"}
          style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {isBackendOnline ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{isBackendOnline ? "API Online" : "Offline Mode"}</span>
        </div>

        {/* Dark / Light Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', borderRadius: '50px' }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <>
              <FiMoon style={{ color: '#F59E0B' }} />
              <span style={{ fontSize: '0.85rem' }}>Dark</span>
            </>
          ) : (
            <>
              <FiSun style={{ color: '#F59E0B' }} />
              <span style={{ fontSize: '0.85rem' }}>Light</span>
            </>
          )}
        </button>

        {/* Notifications Icon */}
        <button className="btn btn-secondary" style={{ padding: '10px', borderRadius: '50%' }} title="Notifications">
          <FiBell />
        </button>

        {/* Profile Info (Removed harsh initial block box) */}
        <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem' }}>{salutation} {userName}</strong>
            <small style={{ color: isAdmin ? '#3B82F6' : '#10B981', fontWeight: 600, display: 'block' }}>
              {isAdmin ? "System Executive" : "Marketplace Seller"}
            </small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;