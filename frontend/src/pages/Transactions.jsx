import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiDollarSign, FiCheckCircle, FiClock, FiFileText, FiDownload } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import { exportExcel, exportCSV, exportPDF } from "../services/exportService";

const transactionData = [
  { id: 1001, customer: "Mounish Sai Gandhi", product: "Mechanical Keyboard", amount: "$89.99", date: "2026-08-01", status: "Completed", payment: "Credit Card" },
  { id: 1002, customer: "Rahul Sharma", product: "Ergonomic Mouse", amount: "$45.00", date: "2026-08-01", status: "Processing", payment: "PayPal" },
  { id: 1003, customer: "Ravi Kumar", product: "Bluetooth Speaker", amount: "$199.99", date: "2026-07-31", status: "Completed", payment: "UPI" },
  { id: 1004, customer: "Anjali Sharma", product: "UltraWide Monitor", amount: "$549.00", date: "2026-07-31", status: "Completed", payment: "Credit Card" },
  { id: 1005, customer: "Alice Smith", product: "USB-C Hub", amount: "$34.50", date: "2026-07-30", status: "Refunded", payment: "Debit Card" },
];

function Transactions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTransactions = useMemo(() => {
    return transactionData.filter((t) => {
      const matchesSearch = t.customer.toLowerCase().includes(search.toLowerCase()) ||
                            t.product.toLowerCase().includes(search.toLowerCase()) ||
                            t.id.toString().includes(search);
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const handleExportPDF = () => {
    exportPDF(filteredTransactions.map(t => ({ id: t.id, name: t.customer, email: `${t.product} (${t.amount})` })));
    toast.success("Downloaded PDF Report!");
  };

  const handleExportExcel = () => {
    exportExcel(filteredTransactions);
    toast.success("Downloaded Excel Report!");
  };

  const handleExportCSV = () => {
    exportCSV(filteredTransactions);
    toast.success("Downloaded CSV Report!");
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
      <Header title="Transaction Ledger" subtitle="Audit payment histories, order fulfillment status, and financial exports" />

      {/* KPI Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <StatsCard title="Total Volume" value="$918.48" icon={<FiDollarSign />} color="#2563EB" change="5 transactions" />
        <StatsCard title="Completed Orders" value={transactionData.filter(t => t.status === 'Completed').length} icon={<FiCheckCircle />} color="#10B981" change="60% success" />
        <StatsCard title="Pending / Processing" value={transactionData.filter(t => t.status === 'Processing').length} icon={<FiClock />} color="#F59E0B" change="1 in queue" />
      </div>

      {/* Search & Export Toolbar */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search transactions by customer, product, or ID..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleExportCSV}>
              <FiDownload /> CSV
            </button>
            <button className="btn btn-secondary" onClick={handleExportExcel}>
              <FiDownload /> Excel
            </button>
            <button className="btn btn-primary" onClick={handleExportPDF}>
              <FiFileText /> PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="chart-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Purchased Product</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Order Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>#ORD-{t.id}</td>
                  <td style={{ fontWeight: 700 }}>{t.customer}</td>
                  <td>{t.product}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{t.amount}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.payment}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.date}</td>
                  <td>
                    <span className={`badge ${t.status === 'Completed' ? 'badge-success' : t.status === 'Processing' ? 'badge-warning' : 'badge-danger'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Transactions;