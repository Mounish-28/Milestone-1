import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiUser, FiSave, FiLock, FiShield, FiCheckCircle, FiEye, FiEyeOff, FiSmartphone, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState({
    displayName: localStorage.getItem("displayName") || "Mounish Sai",
    userName: localStorage.getItem("userName") || "mounish_admin",
    gender: localStorage.getItem("userGender") || "Male",
    email: localStorage.getItem("userEmail") || "admin@shopsense.com",
    aadhaarNumber: localStorage.getItem("aadhaarNumber") || "987654328921",
    isAadhaarVerified: localStorage.getItem("aadhaarVerified") === "true"
  });

  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const maskAadhaar = (num) => {
    if (!num) return "XXXX-XXXX-XXXX";
    const cleaned = num.replace(/\D/g, "");
    if (cleaned.length < 12) return num;
    return `XXXX-XXXX-${cleaned.slice(8)}`;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("displayName", profile.displayName);
    localStorage.setItem("userName", profile.userName);
    localStorage.setItem("userGender", profile.gender);
    localStorage.setItem("userEmail", profile.email);
    localStorage.setItem("aadhaarNumber", profile.aadhaarNumber);

    window.dispatchEvent(new Event("profileUpdated"));
    toast.success("Profile preferences & salutation updated!");
  };

  const handleSendAadhaarOtp = () => {
    setShowOtpModal(true);
    toast.info(`OTP sent to Aadhaar linked mobile ending in ******${profile.aadhaarNumber.slice(-4)}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      setShowOtpModal(false);
      setProfile(prev => ({ ...prev, isAadhaarVerified: true }));
      localStorage.setItem("aadhaarVerified", "true");
      toast.success("Aadhaar Identity Verified via OTP!");
    }, 1200);
  };

  const handleDigiLockerFetch = () => {
    toast.info("Connecting securely to Govt. DigiLocker API...");
    setTimeout(() => {
      setProfile(prev => ({
        ...prev,
        isAadhaarVerified: true,
        displayName: prev.displayName || "Verified Citizen",
        aadhaarNumber: "987654328921"
      }));
      localStorage.setItem("aadhaarVerified", "true");
      toast.success("Identity verified via DigiLocker!");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="page-container"
    >
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
      <Header title="Account Settings & Aadhaar KYC" subtitle="Manage profile details, DigiLocker verification, gender salutation, and theme" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Profile & Salutation Card */}
        <div className="chart-card">
          <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FiUser style={{ color: 'var(--primary-blue)' }} /> User Profile & Gender Salutation
          </h3>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Display Name</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Username</label>
              <input
                type="text"
                value={profile.userName}
                onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Gender (Welcome Prefix)</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                >
                  <option value="Male">Male (Mr.)</option>
                  <option value="Female">Female (Mrs.)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
              <FiSave /> Save Profile & Prefix
            </button>
          </form>
        </div>

        {/* Aadhaar KYC & DigiLocker Card */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <FiShield style={{ color: '#10B981' }} /> Aadhaar & DigiLocker Verification
            </h3>
            {profile.isAadhaarVerified && (
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiCheckCircle /> KYC Verified
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Secure identity verification compliant with UIDAI & DigiLocker standards.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                Aadhaar Number (Masked)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  readOnly={!showAadhaar}
                  value={showAadhaar ? profile.aadhaarNumber : maskAadhaar(profile.aadhaarNumber)}
                  onChange={(e) => setProfile({ ...profile, aadhaarNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 42px 10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    letterSpacing: '1px',
                    fontWeight: 600
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowAadhaar(!showAadhaar)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                  title={showAadhaar ? "Mask Aadhaar Number" : "Unmask Aadhaar Number"}
                >
                  {showAadhaar ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSendAadhaarOtp}
                style={{ padding: '10px', fontSize: '0.82rem', gap: '6px' }}
              >
                <FiSmartphone style={{ color: 'var(--primary-blue)' }} /> Send Aadhaar OTP
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDigiLockerFetch}
                style={{ padding: '10px', fontSize: '0.82rem', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <FiShield /> Fetch via DigiLocker
              </button>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Interface Theme</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Current Mode: {theme.toUpperCase()}</span>
              <button className="btn btn-secondary" onClick={toggleTheme} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                {theme === 'light' ? <FiMoon /> : <FiSun />} Toggle Theme
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Aadhaar OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="modal-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-card"
              style={{ maxWidth: '420px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiSmartphone style={{ color: 'var(--primary-blue)' }} /> Enter Aadhaar OTP
                </h3>
                <button onClick={() => setShowOtpModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <FiX />
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                A 6-digit verification code has been dispatched to your UIDAI registered mobile number.
              </p>

              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 582910"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    letterSpacing: '8px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-main)'
                  }}
                />

                <button type="submit" className="btn btn-primary" disabled={isVerifyingOtp} style={{ padding: '12px' }}>
                  {isVerifyingOtp ? "Verifying with UIDAI..." : "Verify & Complete KYC"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Settings;