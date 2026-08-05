import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiBox,
  FiUserCheck,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiShoppingBag,
  FiShield
} from "react-icons/fi";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("userRole") || "admin");

  useEffect(() => {
    const handleStorage = () => {
      setRole(localStorage.getItem("userRole") || "admin");
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("roleChanged", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("roleChanged", handleStorage);
    };
  }, []);

  const isAdmin = role === "admin";

  const adminMenuItems = [
    { name: "Executive Dashboard", path: "/", icon: <FiGrid /> },
    { name: "Platform Analytics", path: "/analytics", icon: <FiTrendingUp /> },
    { name: "Vendor Management", path: "/vendors", icon: <FiUsers /> },
    { name: "Customers Directory", path: "/customers", icon: <FiUserCheck /> },
    { name: "Global Transactions", path: "/transactions", icon: <FiDollarSign /> },
    { name: "System Reports", path: "/reports", icon: <FiFileText /> },
    { name: "Admin Settings", path: "/settings", icon: <FiSettings /> },
  ];

  const vendorMenuItems = [
    { name: "Store Dashboard", path: "/", icon: <FiGrid /> },
    { name: "My Products Catalog", path: "/products", icon: <FiBox /> },
    { name: "Sales & Earnings", path: "/transactions", icon: <FiDollarSign /> },
    { name: "Store Reports", path: "/reports", icon: <FiFileText /> },
    { name: "Store Settings", path: "/settings", icon: <FiSettings /> },
  ];

  const currentMenuItems = isAdmin ? adminMenuItems : vendorMenuItems;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="logo-section">
        <div
          className="logo-icon"
          style={{
            background: isAdmin
              ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
              : "linear-gradient(135deg, #10B981 0%, #059669 100%)"
          }}
        >
          {isAdmin ? <FiShield /> : <FiShoppingBag />}
        </div>
        <div>
          <h2>ShopSense</h2>
          <p style={{ color: isAdmin ? "#60A5FA" : "#34D399", fontWeight: 700, fontSize: "0.75rem" }}>
            {isAdmin ? "SYSTEM ADMIN" : "VENDOR PORTAL"}
          </p>
        </div>
      </div>

      {/* Navigation Group */}
      <div className="menu-group" style={{ marginTop: "16px" }}>
        <span className="menu-label">
          {isAdmin ? "ADMINISTRATION" : "STOREFRONT MANAGEMENT"}
        </span>
        <nav className="nav-list">
          {currentMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              style={({ isActive }) => ({
                background: isActive
                  ? isAdmin
                    ? "#2563EB"
                    : "#10B981"
                  : undefined
              })}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-name">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;