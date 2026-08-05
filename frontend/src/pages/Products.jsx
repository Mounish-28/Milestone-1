import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiTrash2,
  FiBox,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiMaximize2,
  FiCamera,
  FiEdit2,
  FiSlash
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import { getProducts, createProduct, deleteProduct } from "../services/api";

const initialProducts = [
  { id: 101, name: "Mechanical Gaming Keyboard", category: "Electronics", price: 89.99, vendor_id: 1, stock: "In Stock" },
  { id: 102, name: "Ergonomic Wireless Mouse", category: "Accessories", price: 45.00, vendor_id: 1, stock: "In Stock" },
  { id: 103, name: "UltraWide Monitor 34-Inch", category: "Displays", price: 549.00, vendor_id: 2, stock: "Low Stock" },
  { id: 104, name: "Noise Cancelling Headphones", category: "Audio", price: 199.99, vendor_id: 2, stock: "No Stock" },
  { id: 105, name: "USB-C Multi-Port Adapter Hub", category: "Accessories", price: 34.50, vendor_id: 1, stock: "In Stock" },
];

const sampleQrCodes = [
  { name: "Smart Fitness Watch Ultra", category: "Electronics", price: 189.99, stock: "In Stock" },
  { name: "Organic Roasted Coffee Beans 1kg", category: "Grocery", price: 24.50, stock: "In Stock" },
  { name: "Pro Noise-Isolating Earbuds", category: "Audio", price: 129.00, stock: "Low Stock" },
  { name: "Aluminum Laptop Stand Mount", category: "Accessories", price: 39.99, stock: "In Stock" },
];

function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Electronics",
    price: "",
    vendor_id: "1",
    stock: "In Stock" // 'In Stock' | 'Low Stock' | 'No Stock'
  });

  useEffect(() => {
    async function fetchProductsList() {
      try {
        const data = await getProducts();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.map(p => ({
            ...p,
            category: p.category || "Electronics",
            stock: p.stock || "In Stock"
          })));
        }
      } catch {
        // Fallback to static mock products
      }
    }
    fetchProductsList();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                            p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.error("Please enter valid product name and price");
      return;
    }

    try {
      const created = await createProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        vendor_id: parseInt(newProduct.vendor_id, 10) || 1
      });
      setProducts(prev => [{ ...created, stock: newProduct.stock }, ...prev]);
      toast.success("Product created successfully!");
    } catch {
      // Local optimistic add
      const mockCreated = {
        id: Date.now(),
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        vendor_id: parseInt(newProduct.vendor_id, 10) || 1,
        stock: newProduct.stock
      };
      setProducts(prev => [mockCreated, ...prev]);
      toast.success("Product added to inventory!");
    }
    setShowModal(false);
    setNewProduct({ name: "", category: "Electronics", price: "", vendor_id: "1", stock: "In Stock" });
  };

  const handleScanQrPreset = (preset) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setNewProduct({
        name: preset.name,
        category: preset.category,
        price: preset.price.toString(),
        vendor_id: "1",
        stock: preset.stock
      });
      setShowQrModal(false);
      setShowModal(true);
      toast.success(`QR Code Scanned! Loaded details for ${preset.name}`);
    }, 1200);
  };

  const updateStockStatus = (productId, newStockStatus) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, stock: newStockStatus } : p)
    );
    toast.info(`Updated stock status to '${newStockStatus}'`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.info("Product removed from inventory");
    } catch {
      toast.info("Product removed locally");
    }
    setProducts(prev => prev.filter(p => p.id !== id));
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
      <Header title="Product Inventory Management" subtitle="Scan QR codes, list items, and manage real-time stock levels" />

      {/* KPI Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <StatsCard title="Total Products" value={products.length} icon={<FiBox />} color="#2563EB" change="+6 new" />
        <StatsCard title="In Stock" value={products.filter(p => p.stock === 'In Stock').length} icon={<FiCheckCircle />} color="#10B981" change="Available" />
        <StatsCard title="Low Stock" value={products.filter(p => p.stock === 'Low Stock').length} icon={<FiAlertTriangle />} color="#F59E0B" change="Refill soon" isPositive={false} />
        <StatsCard title="No Stock" value={products.filter(p => p.stock === 'No Stock').length} icon={<FiSlash />} color="#EF4444" change="Out of stock" isPositive={false} />
      </div>

      {/* Toolbar & Filters */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search products by name or category..."
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Displays">Displays</option>
              <option value="Audio">Audio</option>
              <option value="Grocery">Grocery</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Scan QR Button */}
            <button
              className="btn btn-secondary"
              onClick={() => setShowQrModal(true)}
              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              <FiCamera /> Scan QR Code
            </button>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <FiPlus /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="chart-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Price</th>
                <th>Vendor</th>
                <th>Stock Option</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No products match your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td style={{ fontWeight: 600 }}>#{product.id}</td>
                    <td style={{ fontWeight: 600 }}>{product.name}</td>
                    <td>
                      <span className="badge badge-info">{product.category}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>${parseFloat(product.price).toFixed(2)}</td>
                    <td>Vendor #{product.vendor_id}</td>
                    <td>
                      {/* Interactive 3 Stock Option Dropdown */}
                      <select
                        value={product.stock}
                        onChange={(e) => updateStockStatus(product.id, e.target.value)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          border: "none",
                          cursor: "pointer",
                          background: product.stock === "In Stock" ? "rgba(16, 185, 129, 0.15)" : product.stock === "Low Stock" ? "rgba(245, 158, 11, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: product.stock === "In Stock" ? "#10B981" : product.stock === "Low Stock" ? "#F59E0B" : "#EF4444",
                          outline: "none"
                        }}
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="No Stock">No Stock</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(product.id)}
                        title="Delete product"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Scanner Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="modal-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-card"
              style={{ maxWidth: '520px', textAlign: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiCamera style={{ color: '#10B981' }} /> Scan Product QR Code
                </h3>
                <button
                  onClick={() => setShowQrModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  <FiX />
                </button>
              </div>

              {/* Viewfinder simulation */}
              <div
                style={{
                  height: '200px',
                  background: '#0F172A',
                  borderRadius: '12px',
                  border: '2px dashed #10B981',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '20px',
                  overflow: 'hidden'
                }}
              >
                {isScanning ? (
                  <motion.div
                    animate={{ y: [-70, 70, -70] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{
                      width: '80%',
                      height: '3px',
                      background: '#10B981',
                      boxShadow: '0 0 15px #10B981'
                    }}
                  />
                ) : (
                  <>
                    <FiMaximize2 style={{ fontSize: '3rem', color: '#10B981', opacity: 0.8 }} />
                    <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                      Position Product QR code within camera viewfinder to auto-generate details
                    </p>
                  </>
                )}
              </div>

              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Or select sample QR code payload:
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                {sampleQrCodes.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleScanQrPreset(sample)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-surface-hover)',
                      color: 'var(--text-main)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.82rem'
                    }}
                  >
                    <strong style={{ display: 'block', color: 'var(--primary-blue)' }}>{sample.name}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{sample.category} • ${sample.price}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add New Product Listing</h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Fitness Watch Ultra"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Product Type / Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Displays">Displays</option>
                      <option value="Audio">Audio</option>
                      <option value="Grocery">Grocery</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="189.99"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                {/* 3 Stock Option Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Stock Option</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {["In Stock", "Low Stock", "No Stock"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, stock: option })}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: newProduct.stock === option ? `2px solid ${option === 'In Stock' ? '#10B981' : option === 'Low Stock' ? '#F59E0B' : '#EF4444'}` : '1px solid var(--border-color)',
                          background: newProduct.stock === option ? (option === 'In Stock' ? 'rgba(16, 185, 129, 0.15)' : option === 'Low Stock' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)') : 'var(--bg-primary)',
                          color: newProduct.stock === option ? (option === 'In Stock' ? '#10B981' : option === 'Low Stock' ? '#F59E0B' : '#EF4444') : 'var(--text-muted)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Product Listing
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

export default Products;