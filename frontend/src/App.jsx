import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import GeminiAssistant from "./components/GeminiAssistant";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import Vendors from "./pages/Vendors";
import Customers from "./pages/Customers";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/admin/login") ||
    location.pathname.startsWith("/vendor/login") ||
    location.pathname === "/signup";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Hide sidebar on Auth pages (Login/Signup) */}
      {!isAuthPage && <Sidebar />}

      <main
        style={{
          flex: 1,
          marginLeft: isAuthPage ? 0 : "260px",
          padding: isAuthPage ? 0 : "28px",
          width: isAuthPage ? "100%" : "calc(100% - 260px)",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease, width 0.3s ease"
        }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/products" element={<Products />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/admin" element={<Login />} />
            <Route path="/login/vendor" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/vendor/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Gemini 3.6 Flash (High) AI Assistant Widget */}
      {!isAuthPage && <GeminiAssistant />}
    </div>
  );
}

export default App;