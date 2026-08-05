import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiSearch, FiUsers, FiMapPin, FiCheckCircle, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import { getCustomers, createCustomer } from "../services/api";

const initialCustomers = [
  { id: 1, name: "Mounish Sai Gandhi", email: "mounish@example.com", phone: "+91 98765 43210", city: "Hyderabad", orders: 18, status: "Active" },
  { id: 2, name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91 98123 45678", city: "Bengaluru", orders: 12, status: "Active" },
  { id: 3, name: "Ravi Kumar", email: "ravi123@gmail.com", phone: "+91 99887 76655", city: "Chennai", orders: 6, status: "Active" },
  { id: 4, name: "Anjali Sharma", email: "anjali2026@gmail.com", phone: "+91 97766 55443", city: "Hyderabad", orders: 24, status: "Active" },
];

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", city: "" });

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers();
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data.map(c => ({
            ...c,
            phone: c.phone || "+91 98000 12345",
            orders: Math.floor(Math.random() * 20) + 1,
            status: "Active"
          })));
        }
      } catch {
        // Fallback
      }
    }
    loadCustomers();
  }, []);

  const cities = useMemo(() => {
    const list = Array.from(new Set(customers.map(c => c.city).filter(Boolean)));
    return ["All", ...list];
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                            c.email.toLowerCase().includes(search.toLowerCase()) ||
                            c.city.toLowerCase().includes(search.toLowerCase());
      const matchesCity = cityFilter === "All" || c.city === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [customers, search, cityFilter]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email || !newCustomer.city) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const created = await createCustomer({
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone || "+1 555-0199",
        city: newCustomer.city
      });
      setCustomers(prev => [{ ...created, orders: 1, status: "Active" }, ...prev]);
      toast.success("Customer added successfully!");
    } catch {
      const mockCreated = {
        id: Date.now(),
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone || "+1 555-0199",
        city: newCustomer.city,
        orders: 1,
        status: "Active"
      };
      setCustomers(prev => [mockCreated, ...prev]);
      toast.success("Customer added locally!");
    }
    setShowModal(false);
    setNewCustomer({ name: "", email: "", phone: "", city: "" });
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
      <Header title="Customer Intelligence" subtitle="Manage customer profiles, order history, and geographic reach" />

      {/* KPI Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <StatsCard title="Total Customers" value={customers.length} icon={<FiUsers />} color="#2563EB" change="+14.2% growth" />
        <StatsCard title="Active Buyers" value={customers.filter(c => c.status === 'Active').length} icon={<FiCheckCircle />} color="#10B981" change="High engagement" />
        <StatsCard title="Cities Covered" value={cities.length - 1} icon={<FiMapPin />} color="#8B5CF6" change="Across India" />
      </div>

      {/* Search & Filter Bar */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search customers by name, email, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            >
              {cities.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Add Customer
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="chart-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>City</th>
                <th>Total Orders</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td style={{ fontWeight: 600 }}>#{customer.id}</td>
                  <td style={{ fontWeight: 700 }}>{customer.name}</td>
                  <td style={{ color: 'var(--primary-blue)' }}>{customer.email}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{customer.phone}</td>
                  <td>
                    <span className="badge badge-info">{customer.city}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{customer.orders} orders</td>
                  <td>
                    <span className="badge badge-success">{customer.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add New Customer</h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>City</label>
                    <input
                      type="text"
                      required
                      placeholder="Hyderabad"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Customers;