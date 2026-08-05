import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingBag, FiMail, FiLock, FiBriefcase, FiArrowRight, FiShield, FiUserPlus } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VendorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("vendor@shopsense.com");
  const [password, setPassword] = useState("vendor123");
  const [storeId, setStoreId] = useState("STORE-7890");
  const [rememberMe, setRememberMe] = useState(true);

  const handleVendorLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your vendor email and password.");
      return;
    }

    // Set active user role session
    localStorage.setItem("userRole", "vendor");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", "Partner Vendor");

    toast.success("Welcome back to your Vendor Dashboard!");
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  const handleFillDemo = () => {
    setEmail("vendor@shopsense.com");
    setPassword("vendor123");
    setStoreId("STORE-7890");
    toast.info("Demo Vendor credentials loaded!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #064E3B 0%, #0F172A 60%, #022C22 100%)",
        padding: "24px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />

      {/* Background glow effects */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "rgba(16, 185, 129, 0.15)",
          filter: "blur(120px)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "400px",
          height: "400px",
          background: "rgba(5, 150, 105, 0.15)",
          filter: "blur(120px)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "rgba(17, 24, 39, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          color: "#F9FAFB"
        }}
      >
        {/* Top Role Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
              background: "rgba(16, 185, 129, 0.2)",
              color: "#34D399",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              textTransform: "uppercase"
            }}
          >
            <FiBriefcase style={{ fontSize: "0.9rem" }} /> Vendor Partner Portal
          </span>
          <Link
            to="/login/admin"
            style={{
              fontSize: "0.82rem",
              color: "#9CA3AF",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <FiShield /> Switch to Admin Portal
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              margin: "0 auto 16px auto",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "1.8rem",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)"
            }}
          >
            <FiShoppingBag />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
            Vendor Sign In
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#9CA3AF", marginTop: "6px" }}>
            Manage catalog items, product prices, order metrics, & store listings
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVendorLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
              Vendor Business Email
            </label>
            <div style={{ position: "relative" }}>
              <FiMail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor@shopsense.com"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: "10px",
                  border: "1px solid #374151",
                  background: "#1F2937",
                  color: "#F9FAFB",
                  fontSize: "0.92rem",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
              Vendor Account Password
            </label>
            <div style={{ position: "relative" }}>
              <FiLock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: "10px",
                  border: "1px solid #374151",
                  background: "#1F2937",
                  color: "#F9FAFB",
                  fontSize: "0.92rem",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.83rem", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
              Store / Merchant Code (Optional)
            </label>
            <div style={{ position: "relative" }}>
              <FiBriefcase style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
              <input
                type="text"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                placeholder="STORE-7890"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: "10px",
                  border: "1px solid #374151",
                  background: "#1F2937",
                  color: "#F9FAFB",
                  fontSize: "0.92rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9CA3AF", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "#10B981", width: "16px", height: "16px" }}
              />
              Remember store session
            </label>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: "none",
                border: "none",
                color: "#34D399",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.82rem"
              }}
            >
              Fill Demo Vendor
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "#FFFFFF",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.35)",
              transition: "transform 0.2s ease"
            }}
          >
            Enter Vendor Portal <FiArrowRight />
          </button>
        </form>

        {/* Footer Nav */}
        <div style={{ textAlign: "center", marginTop: "28px", borderTop: "1px solid #1F2937", paddingTop: "20px" }}>
          <p style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>
            Want to become a ShopSense Vendor partner?{" "}
            <Link to="/signup" style={{ color: "#34D399", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <FiUserPlus /> Register Now
            </Link>
          </p>
          <div style={{ marginTop: "12px" }}>
            <Link to="/login" style={{ fontSize: "0.82rem", color: "#6B7280", textDecoration: "underline" }}>
              Return to Portal Gateway
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VendorLogin;
