import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiDownload,
  FiArrowRight,
  FiShield,
  FiBriefcase,
  FiStar,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiAward,
  FiAlertTriangle
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import DashboardCharts from "../components/DashboardCharts";
import { getVendors, getProducts, getCustomers, getVendorAnalytics } from "../services/api";
import { exportCSV } from "../services/exportService";

const recentOrders = [
  { id: "ORD-9482", customer: "Mounish Sai", amount: "$349.00", status: "Completed", date: "2026-08-01" },
  { id: "ORD-9481", customer: "Rahul Sharma", amount: "$129.50", status: "Processing", date: "2026-08-01" },
  { id: "ORD-9480", customer: "Ravi Kumar", amount: "$89.99", status: "Completed", date: "2026-07-31" },
  { id: "ORD-9479", customer: "Anjali Sharma", amount: "$540.00", status: "Completed", date: "2026-07-31" },
  { id: "ORD-9478", customer: "Alice Smith", amount: "$75.20", status: "Shipped", date: "2026-07-30" },
];

function Dashboard() {
  const [role, setRole] = useState(localStorage.getItem("userRole") || "admin");
  const [stats, setStats] = useState({
    vendors: 12,
    products: 48,
    customers: 154,
    revenue: "$128,450"
  });

  const [vendorAnalytics, setVendorAnalytics] = useState({
    total_monthly_income: 106920.0,
    total_yearly_income: 1283040.0,
    highest_performing_vendor: { name: "Tech Supplies Inc", monthly_income: 48250.0, yearly_income: 579000.0, orders_count: 142 },
    lowest_performing_vendor: { name: "Nova Gadgets Co", monthly_income: 4120.0, yearly_income: 49440.0, orders_count: 12 }
  });

  useEffect(() => {
    const handleRoleChange = () => {
      setRole(localStorage.getItem("userRole") || "admin");
    };
    window.addEventListener("roleChanged", handleRoleChange);
    window.addEventListener("storage", handleRoleChange);

    async function loadData() {
      try {
        const [vList, pList, cList, vAnalytics] = await Promise.allSettled([
          getVendors(),
          getProducts(),
          getCustomers(),
          getVendorAnalytics()
        ]);

        setStats(prev => ({
          ...prev,
          vendors: vList.status === "fulfilled" && Array.isArray(vList.value) ? vList.value.length : 12,
          products: pList.status === "fulfilled" && Array.isArray(pList.value) ? pList.value.length : 48,
          customers: cList.status === "fulfilled" && Array.isArray(cList.value) ? cList.value.length : 154,
        }));

        if (vAnalytics.status === "fulfilled" && vAnalytics.value) {
          setVendorAnalytics(vAnalytics.value);
        }
      } catch {
        // Fallback
      }
    }
    loadData();

    return () => {
      window.removeEventListener("roleChanged", handleRoleChange);
      window.removeEventListener("storage", handleRoleChange);
    };
  }, []);

  const isAdmin = role === "admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="page-container"
    >
      <Header
        title={isAdmin ? "System Executive Dashboard" : "Vendor Storefront Dashboard"}
        subtitle={isAdmin ? "Platform-wide analytics, vendor revenue rankings, and marketplace stats" : "Manage your store inventory, customer sales, & earnings performance"}
      />

      {/* Role Banner Notification */}
      <div
        style={{
          background: isAdmin ? "rgba(37, 99, 235, 0.08)" : "rgba(16, 185, 129, 0.08)",
          border: `1px solid ${isAdmin ? "rgba(37, 99, 235, 0.25)" : "rgba(16, 185, 129, 0.25)"}`,
          borderRadius: "12px",
          padding: "14px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              padding: "10px",
              borderRadius: "10px",
              background: isAdmin ? "#2563EB" : "#10B981",
              color: "#FFF",
              fontSize: "1.2rem"
            }}
          >
            {isAdmin ? <FiShield /> : <FiBriefcase />}
          </div>
          <div>
            <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>
              {isAdmin ? "Logged in as System Administrator" : "Logged in as Marketplace Partner Vendor"}
            </strong>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {isAdmin
                ? "You have full access to platform-wide administration, vendor monthly/yearly revenue, & sales performance."
                : "You are viewing your dedicated store metrics, product management, & sales analytics."}
            </p>
          </div>
        </div>
      </div>

      {/* Role-Specific Stats Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        {isAdmin ? (
          <>
            <StatsCard title="Monthly Vendor Income" value={`$${vendorAnalytics.total_monthly_income.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} icon={<FiDollarSign />} color="#10B981" change="+18.4% / Month" />
            <StatsCard title="Yearly Vendor Income" value={`$${vendorAnalytics.total_yearly_income.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} icon={<FiCalendar />} color="#2563EB" change="Annual Revenue" />
            <StatsCard title="Catalog Products" value={stats.products} icon={<FiBox />} color="#F59E0B" change="+12.0%" />
            <StatsCard title="Registered Vendors" value={stats.vendors} icon={<FiShoppingBag />} color="#8B5CF6" change="+8.5%" />
          </>
        ) : (
          <>
            <StatsCard title="My Store Monthly Earnings" value="$34,820" icon={<FiDollarSign />} color="#10B981" change="+24.8%" />
            <StatsCard title="My Store Yearly Projections" value="$417,840" icon={<FiCalendar />} color="#2563EB" change="Annual Earnings" />
            <StatsCard title="Listed Products" value="18" icon={<FiBox />} color="#3B82F6" change="+4.2%" />
            <StatsCard title="Completed Orders" value="142" icon={<FiShoppingBag />} color="#8B5CF6" change="+15.6%" />
          </>
        )}
      </div>

      {/* Admin High Sales vs Low Sales Vendors Banner */}
      {isAdmin && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          {/* Top Selling Vendor */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              borderRadius: "16px",
              padding: "18px 20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ background: "#10B981", color: "#FFFFFF", fontSize: "0.76rem", fontWeight: 800, padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FiTrendingUp /> HIGHEST SALES VENDOR (TOP SELLER)
              </span>
              <span style={{ fontSize: "1.2rem" }}>🏆</span>
            </div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "4px" }}>
              {vendorAnalytics.highest_performing_vendor?.name || "Tech Supplies Inc"}
            </h4>
            <div style={{ display: "flex", gap: "16px", fontSize: "0.84rem", color: "var(--text-muted)" }}>
              <span>Monthly: <strong style={{ color: "#10B981" }}>${(vendorAnalytics.highest_performing_vendor?.monthly_income || 48250).toLocaleString()}</strong></span>
              <span>Yearly: <strong style={{ color: "#60A5FA" }}>${(vendorAnalytics.highest_performing_vendor?.yearly_income || 579000).toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Low Selling Vendor */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.05) 100%)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "16px",
              padding: "18px 20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ background: "#EF4444", color: "#FFFFFF", fontSize: "0.76rem", fontWeight: 800, padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FiTrendingDown /> LOWEST SALES VENDOR (LOW SELLER)
              </span>
              <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            </div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "4px" }}>
              {vendorAnalytics.lowest_performing_vendor?.name || "Nova Gadgets Co"}
            </h4>
            <div style={{ display: "flex", gap: "16px", fontSize: "0.84rem", color: "var(--text-muted)" }}>
              <span>Monthly: <strong style={{ color: "#EF4444" }}>${(vendorAnalytics.lowest_performing_vendor?.monthly_income || 4120).toLocaleString()}</strong></span>
              <span>Yearly: <strong style={{ color: "#F59E0B" }}>${(vendorAnalytics.lowest_performing_vendor?.yearly_income || 49440).toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <DashboardCharts />

      {/* Recent Activity Table Card */}
      <div className="chart-card" style={{ marginTop: '24px' }}>
        <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="chart-title">{isAdmin ? "Recent Platform Transactions" : "Recent Store Orders"}</h3>
            <p className="chart-subtitle">{isAdmin ? "Latest marketplace customer order details" : "Orders placed for your store products"}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.825rem' }} onClick={() => exportCSV(recentOrders)}>
              <FiDownload /> Export CSV
            </button>
            <Link to="/transactions" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.825rem' }}>
              View All <FiArrowRight />
            </Link>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.id}</td>
                  <td>{order.customer}</td>
                  <td style={{ fontWeight: 700, color: isAdmin ? 'var(--primary-blue)' : '#10B981' }}>{order.amount}</td>
                  <td>
                    <span className={`badge ${order.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;