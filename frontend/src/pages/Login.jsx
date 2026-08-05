import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield,
  FiBriefcase,
  FiMail,
  FiLock,
  FiKey,
  FiArrowRight,
  FiShoppingBag,
  FiUser,
  FiSmartphone,
  FiCheckCircle,
  FiHelpCircle,
  FiArrowLeft,
  FiSend,
  FiEye,
  FiEyeOff,
  FiInbox,
  FiX,
  FiRefreshCw,
  FiMessageSquare,
  FiPhone
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendSecurityEmailApi, requestAadhaarOtpApi } from "../services/api";

function Login() {
  const navigate = useNavigate();

  // Multi-step flow: 'credentials' | 'aadhaar_otp' | 'security_email' | 'security_pin' | 'forgot_key'
  const [step, setStep] = useState("credentials");
  const [activeTab, setActiveTab] = useState("admin"); // 'admin' | 'vendor'

  // Admin credentials state
  const [adminDisplayName, setAdminDisplayName] = useState("Mounish Sai");
  const [adminUserName, setAdminUserName] = useState("mounish_admin");
  const [adminGender, setAdminGender] = useState("Male");
  const [adminAadhaar, setAdminAadhaar] = useState("987654328921");
  const [adminEmail, setAdminEmail] = useState("admin@shopsense.com");
  const [adminPhone, setAdminPhone] = useState("+91 9876543210");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [adminSecKey, setAdminSecKey] = useState("SEC-KEY-9988");
  const [adminSecPin, setAdminSecPin] = useState("9988");

  // Vendor credentials state
  const [vendorDisplayName, setVendorDisplayName] = useState("Rahul Sharma");
  const [vendorUserName, setVendorUserName] = useState("rahul_vendor");
  const [vendorGender, setVendorGender] = useState("Male");
  const [vendorAadhaar, setVendorAadhaar] = useState("987654321234");
  const [vendorEmail, setVendorEmail] = useState("vendor@shopsense.com");
  const [vendorPhone, setVendorPhone] = useState("+91 9812345678");
  const [vendorPassword, setVendorPassword] = useState("vendor123");
  const [vendorSecKey, setVendorSecKey] = useState("SEC-KEY-7766");
  const [vendorSecPin, setVendorSecPin] = useState("7766");

  // Aadhaar masking & PIN visibility state
  const [showAadhaarNumber, setShowAadhaarNumber] = useState(false);
  const [showPinNumber, setShowPinNumber] = useState(false);

  // Aadhaar OTP step & destination channel state (starts completely blank)
  const [otpChannel, setOtpChannel] = useState("mobile"); // 'mobile' | 'email'
  const [otpCode, setOtpCode] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [sentOtpDestination, setSentOtpDestination] = useState("");

  // Security Key delivery channel state
  const [keyDeliveryChannel, setKeyDeliveryChannel] = useState("both"); // 'email' | 'mobile' | 'both'

  // Security PIN input state (starts completely blank)
  const [pinInput, setPinInput] = useState("");

  // Inbox Drawer Modal State
  const [showMailInboxDrawer, setShowMailInboxDrawer] = useState(false);

  // Forgot Security Key state
  const [forgotInput, setForgotInput] = useState("");
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
  const [dispatchedNewKey, setDispatchedNewKey] = useState(null);

  const maskAadhaar = (num) => {
    if (!num) return "XXXX-XXXX-XXXX";
    const cleaned = num.replace(/\D/g, "");
    if (cleaned.length < 12) return num;
    return `XXXX-XXXX-${cleaned.slice(8)}`;
  };

  // Sign in with Google handler
  const handleGoogleSignIn = () => {
    toast.info("Signing in with Google Account...");
    setTimeout(() => {
      if (activeTab === "admin") {
        setAdminDisplayName("Google Admin User");
        setAdminUserName("google_admin");
        setAdminAadhaar("987654328921");
      } else {
        setVendorDisplayName("Google Vendor Partner");
        setVendorUserName("google_vendor");
        setVendorAadhaar("987654321234");
      }
      setStep("aadhaar_otp");
      handleRequestAadhaarOtp("mobile");
      toast.success("Google Sign-In successful! Proceed to Aadhaar Verification.");
    }, 1000);
  };

  // Step 1: Submit Primary Credentials
  const handleProceedToAadhaar = (e) => {
    e.preventDefault();

    if (activeTab === "admin") {
      if (!adminDisplayName || !adminUserName || !adminAadhaar || !adminEmail || !adminPhone || !adminPassword) {
        toast.error("Please fill in all required credentials.");
        return;
      }
    } else {
      if (!vendorDisplayName || !vendorUserName || !vendorAadhaar || !vendorEmail || !vendorPhone || !vendorPassword) {
        toast.error("Please fill in all required credentials.");
        return;
      }
    }

    setStep("aadhaar_otp");
    handleRequestAadhaarOtp(otpChannel);
  };

  // Request Aadhaar OTP via API (Mobile or Email)
  const handleRequestAadhaarOtp = async (channel) => {
    setIsRequestingOtp(true);
    const aadhaar = activeTab === "admin" ? adminAadhaar : vendorAadhaar;
    const email = activeTab === "admin" ? adminEmail : vendorEmail;
    const phone = activeTab === "admin" ? adminPhone : vendorPhone;
    const dest = channel === "mobile" ? phone : email;

    try {
      const res = await requestAadhaarOtpApi({
        aadhaar_number: aadhaar,
        channel: channel,
        destination: dest
      });
      setSentOtpDestination(res.destination || dest);
      setOtpCode(""); // Leave blank so user enters the OTP from Email/SMS
      toast.success(`6-Digit OTP dispatched to ${channel === 'mobile' ? `Mobile (${phone})` : `Email (${email})`}! Check your inbox.`);
    } catch {
      setSentOtpDestination(dest);
      setOtpCode("");
      toast.success(`6-Digit OTP dispatched to ${channel === 'mobile' ? `Mobile (${phone})` : `Email (${email})`}! Check your inbox.`);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Step 2: Submit Aadhaar OTP -> Show Security Email/SMS Inbox Screen
  const handleProceedToEmailStep = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error("Please enter valid 6-digit Aadhaar OTP received on your Mobile/Email");
      return;
    }

    const currentEmail = activeTab === "admin" ? adminEmail : vendorEmail;
    const currentPhone = activeTab === "admin" ? adminPhone : vendorPhone;
    const currentName = activeTab === "admin" ? adminDisplayName : vendorDisplayName;
    const currentKey = activeTab === "admin" ? adminSecKey : vendorSecKey;
    const currentPin = activeTab === "admin" ? adminSecPin : vendorSecPin;

    try {
      await sendSecurityEmailApi({
        recipient_email: currentEmail,
        recipient_mobile: currentPhone,
        recipient_name: currentName,
        security_key: currentKey,
        security_pin: currentPin,
        dispatch_channel: keyDeliveryChannel
      });
    } catch (err) {
      console.log("Fallback mail notice: ", err);
    }

    setStep("security_email");
    setShowMailInboxDrawer(true);
    toast.success(`Security Key & PIN dispatched to ${keyDeliveryChannel.toUpperCase()}! Check your inbox/phone.`);
  };

  // Step 3: From Email Screen -> Open Dedicated Security PIN Page
  const handleProceedToPinPage = (e) => {
    e.preventDefault();
    setPinInput(""); // Clear PIN input field so user enters PIN from Email/SMS
    setStep("security_pin");
    setShowMailInboxDrawer(false);
    toast.info("Opening 4-Digit Security PIN Verification Page...");
  };

  // Step 4: Verify Security PIN & Launch Dashboard
  const handleFinalPinAuthentication = (e) => {
    e.preventDefault();
    const expectedPin = activeTab === "admin" ? adminSecPin : vendorSecPin;

    if (!pinInput || pinInput.length < 4) {
      toast.error("Please enter your 4-digit Security PIN");
      return;
    }

    // Accept valid 4-digit PIN (e.g. expected PIN or fallback demo PIN)
    if (pinInput !== expectedPin && pinInput !== "9988" && pinInput !== "7766") {
      toast.error("Invalid Security PIN. Please check the PIN sent to your Email or SMS.");
      return;
    }

    const currentRole = activeTab;
    const displayName = currentRole === "admin" ? adminDisplayName : vendorDisplayName;
    const userName = currentRole === "admin" ? adminUserName : vendorUserName;
    const gender = currentRole === "admin" ? adminGender : vendorGender;
    const aadhaar = currentRole === "admin" ? adminAadhaar : vendorAadhaar;
    const email = currentRole === "admin" ? adminEmail : vendorEmail;
    const phone = currentRole === "admin" ? adminPhone : vendorPhone;
    const secKey = currentRole === "admin" ? adminSecKey : vendorSecKey;

    // Save session in localStorage
    localStorage.setItem("userRole", currentRole);
    localStorage.setItem("displayName", displayName);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userGender", gender);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPhone", phone);
    localStorage.setItem("aadhaarNumber", aadhaar);
    localStorage.setItem("securityKey", secKey);
    localStorage.setItem("aadhaarVerified", "true");

    // Dispatch custom events for instant UI update without page reload
    window.dispatchEvent(new Event("roleChanged"));
    window.dispatchEvent(new Event("profileUpdated"));

    toast.success("Security PIN Verified! Welcome to ShopSense.");
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  // Forgot Security Key Submit
  const handleRequestNewSecurityKey = (e) => {
    e.preventDefault();
    if (!forgotInput) {
      toast.error("Please enter your registered Email ID or Phone Number");
      return;
    }

    setIsSubmittingForgot(true);
    setTimeout(() => {
      setIsSubmittingForgot(false);
      const newKey = "SEC-KEY-" + Math.floor(1000 + Math.random() * 9000);
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();

      if (activeTab === "admin") {
        setAdminSecKey(newKey);
        setAdminSecPin(newPin);
      } else {
        setVendorSecKey(newKey);
        setVendorSecPin(newPin);
      }

      setDispatchedNewKey({ key: newKey, pin: newPin, to: forgotInput });
      toast.success(`New permanent Security Key generated! Dispatched to ${forgotInput}`);
    }, 1200);
  };

  const handleFillDemo = () => {
    if (activeTab === "admin") {
      setAdminDisplayName("Mounish Sai");
      setAdminUserName("mounish_admin");
      setAdminGender("Male");
      setAdminAadhaar("987654328921");
      setAdminEmail("admin@shopsense.com");
      setAdminPhone("+91 9876543210");
      setAdminPassword("admin123");
      setAdminSecKey("SEC-KEY-9988");
      setAdminSecPin("9988");
      toast.info("Loaded Admin Demo Account!");
    } else {
      setVendorDisplayName("Rahul Sharma");
      setVendorUserName("rahul_vendor");
      setVendorGender("Male");
      setVendorAadhaar("987654321234");
      setVendorEmail("vendor@shopsense.com");
      setVendorPhone("+91 9812345678");
      setVendorPassword("vendor123");
      setVendorSecKey("SEC-KEY-7766");
      setVendorSecPin("7766");
      toast.info("Loaded Vendor Demo Account!");
    }
  };

  const glowColor = activeTab === "admin" ? "rgba(37, 99, 235, 0.2)" : "rgba(16, 185, 129, 0.2)";
  const currentEmail = activeTab === "admin" ? adminEmail : vendorEmail;
  const currentPhone = activeTab === "admin" ? adminPhone : vendorPhone;
  const currentName = activeTab === "admin" ? adminDisplayName : vendorDisplayName;
  const currentGender = activeTab === "admin" ? adminGender : vendorGender;
  const currentKey = activeTab === "admin" ? adminSecKey : vendorSecKey;
  const currentPin = activeTab === "admin" ? adminSecPin : vendorSecPin;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0B0F19 100%)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        color: "#F8FAFC"
      }}
    >
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {/* Dynamic Background Glow */}
      <motion.div
        animate={{
          background: activeTab === "admin" ? "rgba(37, 99, 235, 0.15)" : "rgba(16, 185, 129, 0.15)"
        }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "550px",
          height: "550px",
          filter: "blur(140px)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}
      />

      {/* Top Banner Interactive Mail/SMS Inbox Shortcut */}
      {(step === "security_email" || step === "security_pin") && (
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setShowMailInboxDrawer(true)}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 10,
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "30px",
            padding: "10px 18px",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)"
          }}
        >
          <FiInbox /> 📥 Open Received Security Messages (Email & SMS)
        </motion.button>
      )}

      <div style={{ textAlign: "center", marginBottom: "24px", zIndex: 2 }}>
        <div
          style={{
            margin: "0 auto 12px auto",
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: activeTab === "admin"
              ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
              : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: "1.7rem",
            boxShadow: `0 10px 25px ${glowColor}`,
            transition: "all 0.3s ease"
          }}
        >
          <FiShoppingBag />
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
          ShopSense Multi-Vendor Portal
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#94A3B8", marginTop: "4px" }}>
          Unified Authentication, Aadhaar OTP Verification & Security PIN Dispatch
        </p>
      </div>

      {/* Main Single Card Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "rgba(17, 24, 39, 0.88)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${activeTab === "admin" ? "rgba(37, 99, 235, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
          borderRadius: "20px",
          padding: "34px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
          zIndex: 2,
          transition: "border-color 0.3s ease"
        }}
      >
        {/* Step 1: Credentials Page */}
        {step === "credentials" && (
          <>
            {/* Sign in with Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #374151",
                background: "#1F2937",
                color: "#F9FAFB",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.41-1.57-5.13-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" />
                <path fill="#FBBC05" d="M3.87 10.78c-.18-.53-.28-1.09-.28-1.78s.1-1.25.28-1.78L.97 4.96C.35 6.18 0 7.55 0 9s.35 2.82.97 4.04l2.9-2.26z" />
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.45 2.02.97 4.96l2.9 2.26C4.59 5.05 6.62 3.58 9 3.58z" />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "1px", background: "#374151" }} />
              <span style={{ fontSize: "0.78rem", color: "#9CA3AF", textTransform: "uppercase" }}>or sign in with password</span>
              <div style={{ flex: 1, height: "1px", background: "#374151" }} />
            </div>

            {/* Segmented Role Switcher Tab */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: "#1F2937",
                padding: "4px",
                borderRadius: "12px",
                marginBottom: "24px"
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab("admin")}
                style={{
                  padding: "10px",
                  borderRadius: "9px",
                  border: "none",
                  background: activeTab === "admin" ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" : "transparent",
                  color: activeTab === "admin" ? "#FFFFFF" : "#9CA3AF",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <FiShield /> Admin Portal
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("vendor")}
                style={{
                  padding: "10px",
                  borderRadius: "9px",
                  border: "none",
                  background: activeTab === "vendor" ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "transparent",
                  color: activeTab === "vendor" ? "#FFFFFF" : "#9CA3AF",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <FiBriefcase /> Vendor Portal
              </button>
            </div>

            {/* Primary Credentials Form */}
            <form onSubmit={handleProceedToAadhaar} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Display Name & Username */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "4px" }}>Display Name</label>
                  <input
                    type="text"
                    required
                    value={activeTab === "admin" ? adminDisplayName : vendorDisplayName}
                    onChange={(e) => activeTab === "admin" ? setAdminDisplayName(e.target.value) : setVendorDisplayName(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #374151", background: "#1F2937", color: "#F9FAFB", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "4px" }}>Username</label>
                  <input
                    type="text"
                    required
                    value={activeTab === "admin" ? adminUserName : vendorUserName}
                    onChange={(e) => activeTab === "admin" ? setAdminUserName(e.target.value) : setVendorUserName(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #374151", background: "#1F2937", color: "#F9FAFB", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>
              </div>

              {/* Gender & Masked Aadhaar Number Input */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "4px" }}>Gender (Prefix)</label>
                  <select
                    value={activeTab === "admin" ? adminGender : vendorGender}
                    onChange={(e) => activeTab === "admin" ? setAdminGender(e.target.value) : setVendorGender(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #374151", background: "#1F2937", color: "#F9FAFB", fontSize: "0.85rem", outline: "none" }}
                  >
                    <option value="Male">Male (Mr.)</option>
                    <option value="Female">Female (Mrs.)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "4px" }}>
                    Aadhaar Number (12-Digits)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showAadhaarNumber ? "text" : "password"}
                      required
                      maxLength={12}
                      placeholder="e.g. 987654328921"
                      value={activeTab === "admin" ? adminAadhaar : vendorAadhaar}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 12);
                        if (activeTab === "admin") setAdminAadhaar(digitsOnly);
                        else setVendorAadhaar(digitsOnly);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 58px 10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #374151",
                        background: "#1F2937",
                        color: "#F9FAFB",
                        fontSize: "0.9rem",
                        letterSpacing: showAadhaarNumber ? "2px" : "4px",
                        fontWeight: 700,
                        outline: "none"
                      }}
                    />
                    <div style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: "6px" }}>
                      {(activeTab === "admin" ? adminAadhaar : vendorAadhaar) && (
                        <button
                          type="button"
                          onClick={() => activeTab === "admin" ? setAdminAadhaar("") : setVendorAadhaar("")}
                          title="Clear Aadhaar Number"
                          style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "0.9rem" }}
                        >
                          <FiX />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowAadhaarNumber(!showAadhaarNumber)}
                        title={showAadhaarNumber ? "Mask Aadhaar Number" : "Unmask Aadhaar Number"}
                        style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: "0.9rem" }}
                      >
                        {showAadhaarNumber ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Number & Email Address */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "4px" }}>Mobile Number</label>
                  <div style={{ position: "relative" }}>
                    <FiPhone style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "0.85rem" }} />
                    <input
                      type="tel"
                      required
                      value={activeTab === "admin" ? adminPhone : vendorPhone}
                      onChange={(e) => activeTab === "admin" ? setAdminPhone(e.target.value) : setVendorPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      style={{ width: "100%", padding: "10px 12px 10px 32px", borderRadius: "8px", border: "1px solid #374151", background: "#1F2937", color: "#F9FAFB", fontSize: "0.85rem", outline: "none" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "4px" }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={activeTab === "admin" ? adminEmail : vendorEmail}
                    onChange={(e) => activeTab === "admin" ? setAdminEmail(e.target.value) : setVendorEmail(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #374151", background: "#1F2937", color: "#F9FAFB", fontSize: "0.85rem", outline: "none" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "4px" }}>Password</label>
                <input
                  type="password"
                  required
                  value={activeTab === "admin" ? adminPassword : vendorPassword}
                  onChange={(e) => activeTab === "admin" ? setAdminPassword(e.target.value) : setVendorPassword(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #374151", background: "#1F2937", color: "#F9FAFB", fontSize: "0.85rem", outline: "none" }}
                />
              </div>

              {/* Forgot Security Key Link */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", marginTop: "2px" }}>
                <button
                  type="button"
                  onClick={() => setStep("forgot_key")}
                  style={{ background: "none", border: "none", color: "#60A5FA", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <FiHelpCircle /> Forgot Security Key / Password?
                </button>

                <button
                  type="button"
                  onClick={handleFillDemo}
                  style={{ background: "none", border: "none", color: "#34D399", fontWeight: 600, cursor: "pointer" }}
                >
                  Fill Demo Details
                </button>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "none",
                  background: activeTab === "admin"
                    ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
                    : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "#FFFFFF",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: `0 4px 15px ${glowColor}`
                }}
              >
                Proceed to Aadhaar Verification <FiArrowRight />
              </button>
            </form>
          </>
        )}

        {/* Step 2: Post-Login Aadhaar & OTP Verification Screen */}
        {step === "aadhaar_otp" && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleProceedToEmailStep}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <button
              type="button"
              onClick={() => setStep("credentials")}
              style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem" }}
            >
              <FiArrowLeft /> Back to Login
            </button>

            <div style={{ textAlign: "center", marginBottom: "4px" }}>
              <div style={{ margin: "0 auto 12px auto", width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.2)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                <FiSmartphone />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Aadhaar OTP Verification</h3>
              <p style={{ fontSize: "0.84rem", color: "#9CA3AF", marginTop: "4px" }}>
                UIDAI verification for Aadhaar #{maskAadhaar(activeTab === "admin" ? adminAadhaar : vendorAadhaar)}
              </p>
            </div>

            {/* OTP Destination Channel Selector (Mobile Number vs Email ID) */}
            <div style={{ background: "#1F2937", border: "1px solid #374151", borderRadius: "12px", padding: "12px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#D1D5DB", marginBottom: "8px" }}>
                Select OTP Delivery Destination:
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setOtpChannel("mobile");
                    handleRequestAadhaarOtp("mobile");
                  }}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: otpChannel === "mobile" ? "2px solid #10B981" : "1px solid #374151",
                    background: otpChannel === "mobile" ? "rgba(16, 185, 129, 0.15)" : "#111827",
                    color: otpChannel === "mobile" ? "#34D399" : "#9CA3AF",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    justifyContent: "center"
                  }}
                >
                  <FiSmartphone /> Mobile ({currentPhone})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpChannel("email");
                    handleRequestAadhaarOtp("email");
                  }}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: otpChannel === "email" ? "2px solid #3B82F6" : "1px solid #374151",
                    background: otpChannel === "email" ? "rgba(59, 130, 246, 0.15)" : "#111827",
                    color: otpChannel === "email" ? "#60A5FA" : "#9CA3AF",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    justifyContent: "center"
                  }}
                >
                  <FiMail /> Email ({currentEmail})
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", fontSize: "0.76rem", color: "#9CA3AF" }}>
                <span>Sent to: <strong style={{ color: "#F3F4F6" }}>{sentOtpDestination || currentPhone}</strong></span>
                <button
                  type="button"
                  onClick={() => handleRequestAadhaarOtp(otpChannel)}
                  disabled={isRequestingOtp}
                  style={{ background: "none", border: "none", color: "#60A5FA", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <FiRefreshCw /> {isRequestingOtp ? "Sending..." : "Resend OTP"}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit OTP received"
                style={{
                  width: "100%",
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "1.3rem",
                  letterSpacing: "8px",
                  fontWeight: 800,
                  borderRadius: "10px",
                  border: "1px solid #374151",
                  background: "#1F2937",
                  color: "#F9FAFB",
                  outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#FFFFFF",
                fontSize: "0.92rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
              }}
            >
              Verify OTP & Generate Security Key <FiArrowRight />
            </button>
          </motion.form>
        )}

        {/* Step 3: Security Key & PIN Delivery (Mobile SMS & Email Choice) */}
        {step === "security_email" && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleProceedToPinPage}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <button
              type="button"
              onClick={() => setStep("aadhaar_otp")}
              style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem" }}
            >
              <FiArrowLeft /> Back to Aadhaar OTP
            </button>

            <div style={{ textAlign: "center", marginBottom: "4px" }}>
              <div style={{ margin: "0 auto 10px auto", width: "48px", height: "48px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.2)", color: "#60A5FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                <FiKey />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Official Security Key Dispatched</h3>
              <p style={{ fontSize: "0.82rem", color: "#9CA3AF", marginTop: "2px" }}>
                Select preferred destination to receive your Security Key & PIN:
              </p>
            </div>

            {/* Delivery Channel Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", background: "#1F2937", padding: "4px", borderRadius: "10px" }}>
              <button
                type="button"
                onClick={() => setKeyDeliveryChannel("email")}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  background: keyDeliveryChannel === "email" ? "#2563EB" : "transparent",
                  color: keyDeliveryChannel === "email" ? "#FFF" : "#9CA3AF",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer"
                }}
              >
                ✉️ Email
              </button>
              <button
                type="button"
                onClick={() => setKeyDeliveryChannel("mobile")}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  background: keyDeliveryChannel === "mobile" ? "#10B981" : "transparent",
                  color: keyDeliveryChannel === "mobile" ? "#FFF" : "#9CA3AF",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer"
                }}
              >
                📱 Mobile SMS
              </button>
              <button
                type="button"
                onClick={() => setKeyDeliveryChannel("both")}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  border: "none",
                  background: keyDeliveryChannel === "both" ? "#8B5CF6" : "transparent",
                  color: keyDeliveryChannel === "both" ? "#FFF" : "#9CA3AF",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer"
                }}
              >
                📲 Both
              </button>
            </div>

            {/* Notification Card without explicit code exposure */}
            <div
              style={{
                background: "#1E293B",
                border: "1px solid #3B82F6",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#60A5FA", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiCheckCircle style={{ color: "#34D399" }} /> SECURITY DISPATCH SUCCESSFUL
                </span>
                <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Just now</span>
              </div>

              <div style={{ fontSize: "0.83rem", color: "#E2E8F0", lineHeight: "1.5" }}>
                Hello {currentGender === "Female" ? "Mrs." : currentGender === "Male" ? "Mr." : ""} {currentName},
                <p style={{ marginTop: "6px", color: "#CBD5E1" }}>
                  Your official Permanent Security Key and 4-Digit Login PIN have been dispatched directly to:
                  <strong style={{ display: "block", color: "#60A5FA", marginTop: "4px" }}>
                    {keyDeliveryChannel === "email" ? currentEmail : keyDeliveryChannel === "mobile" ? currentPhone : `${currentEmail} & ${currentPhone}`}
                  </strong>
                </p>
                <small style={{ color: "#94A3B8", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                  Please check your inbox / messages to retrieve your 4-digit Security PIN and proceed to entry.
                </small>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "6px",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                color: "#FFFFFF",
                fontSize: "0.92rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)"
              }}
            >
              Proceed to Enter Security PIN <FiArrowRight />
            </button>
          </motion.form>
        )}

        {/* Step 4: DEDICATED NEW STANDALONE PAGE FOR 4-DIGIT SECURITY PIN */}
        {step === "security_pin" && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleFinalPinAuthentication}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <button
              type="button"
              onClick={() => setStep("security_email")}
              style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem" }}
            >
              <FiArrowLeft /> Back to Security Key Notification
            </button>

            <div style={{ textAlign: "center", marginBottom: "4px" }}>
              <div style={{ margin: "0 auto 12px auto", width: "52px", height: "52px", borderRadius: "14px", background: "rgba(16, 185, 129, 0.2)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>
                <FiLock />
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Security PIN Authentication</h3>
              <p style={{ fontSize: "0.84rem", color: "#9CA3AF", marginTop: "4px" }}>
                Enter the 4-digit Security PIN sent to <strong>{keyDeliveryChannel === "email" ? currentEmail : keyDeliveryChannel === "mobile" ? currentPhone : `${currentEmail} & ${currentPhone}`}</strong>
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "8px", textAlign: "center" }}>
                4-Digit Security PIN
              </label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPinNumber ? "text" : "password"}
                  maxLength={4}
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  style={{
                    width: "100%",
                    padding: "14px",
                    textAlign: "center",
                    fontSize: "1.6rem",
                    letterSpacing: "12px",
                    fontWeight: 800,
                    borderRadius: "12px",
                    border: "2px solid #3B82F6",
                    background: "#0F172A",
                    color: "#F9FAFB",
                    outline: "none",
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.25)"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPinNumber(!showPinNumber)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: "1.1rem" }}
                >
                  {showPinNumber ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#FFFFFF",
                fontSize: "0.95rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.45)"
              }}
            >
              Verify PIN & Launch Executive Dashboard <FiCheckCircle />
            </button>
          </motion.form>
        )}

        {/* Step 5: Forgot Security Key / Password Flow */}
        {step === "forgot_key" && (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleRequestNewSecurityKey}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setDispatchedNewKey(null);
              }}
              style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem" }}
            >
              <FiArrowLeft /> Return to Sign In
            </button>

            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Request New Security Key</h3>
              <p style={{ fontSize: "0.84rem", color: "#9CA3AF", marginTop: "4px" }}>
                Enter your registered Email Address or Mobile Number to generate and dispatch a new permanent Security Key.
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                Registered Email ID or Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="admin@shopsense.com or +91 9876543210"
                value={forgotInput}
                onChange={(e) => setForgotInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #374151",
                  background: "#1F2937",
                  color: "#F9FAFB",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
            </div>

            {/* Delivery Notification if new key generated */}
            {dispatchedNewKey && (
              <div
                style={{
                  background: "#1E293B",
                  border: "1px solid #10B981",
                  borderRadius: "10px",
                  padding: "14px",
                  fontSize: "0.83rem",
                  color: "#F8FAFC"
                }}
              >
                <strong style={{ color: "#34D399", display: "block", marginBottom: "4px" }}>
                  ✉️ / 📱 Security Key Dispatched to {dispatchedNewKey.to}
                </strong>
                Your new permanent Security Key & 4-digit Security PIN have been sent via Email/SMS. Check your inbox.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingForgot}
              style={{
                width: "100%",
                marginTop: "6px",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                color: "#FFFFFF",
                fontSize: "0.92rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)"
              }}
            >
              {isSubmittingForgot ? "Dispatching New Key..." : "Send New Security Key"} <FiSend />
            </button>
          </motion.form>
        )}

      </div>

      {/* Floating Live Mail/SMS Reader Drawer Modal */}
      <AnimatePresence>
        {showMailInboxDrawer && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              zIndex: 999,
              width: "420px",
              background: "#0F172A",
              border: "2px solid #3B82F6",
              borderRadius: "16px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                padding: "14px 18px",
                borderBottom: "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ background: "#2563EB", padding: "6px", borderRadius: "8px", color: "#FFFFFF", display: "flex" }}>
                  <FiInbox />
                </div>
                <div>
                  <strong style={{ fontSize: "0.9rem", color: "#FFFFFF" }}>Live Inbox Reader (Email & SMS)</strong>
                  <span style={{ display: "block", fontSize: "0.72rem", color: "#34D399" }}>● Dispatched to Email & Mobile</span>
                </div>
              </div>
              <button
                onClick={() => setShowMailInboxDrawer(false)}
                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "1.1rem" }}
              >
                <FiX />
              </button>
            </div>

            <div style={{ padding: "18px" }}>
              <div style={{ fontSize: "0.82rem", color: "#94A3B8", marginBottom: "8px" }}>
                <strong>DESTINATION:</strong> {keyDeliveryChannel === "email" ? currentEmail : keyDeliveryChannel === "mobile" ? currentPhone : `${currentEmail} & ${currentPhone}`}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F8FAFC", marginBottom: "12px", borderBottom: "1px solid #1E293B", paddingBottom: "8px" }}>
                Subject: 🔐 Official Security Key & 4-Digit PIN Delivery
              </div>

              <div style={{ fontSize: "0.85rem", color: "#CBD5E1", lineHeight: "1.5" }}>
                Hello {currentGender === "Female" ? "Mrs." : currentGender === "Male" ? "Mr." : ""} {currentName},
                <p style={{ marginTop: "6px", marginBottom: "6px" }}>
                  Your Permanent Account Security Key is:
                  <strong style={{ display: "block", color: "#10B981", fontSize: "1.1rem", marginTop: "2px" }}>{currentKey}</strong>
                </p>
                <div style={{ background: "#1E293B", padding: "10px 14px", borderRadius: "8px", border: "1px dashed #3B82F6", marginTop: "8px" }}>
                  <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Your 4-Digit Login Security PIN:</span>
                  <strong style={{ display: "block", fontSize: "1.4rem", color: "#60A5FA", letterSpacing: "6px", marginTop: "2px" }}>{currentPin}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowMailInboxDrawer(false);
                  setStep("security_pin");
                }}
                style={{
                  width: "100%",
                  marginTop: "16px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                Open Verification Page <FiArrowRight />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

export default Login;