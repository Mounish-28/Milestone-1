import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Authentication & Aadhaar KYC API
export const loginUserApi = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const googleSignInApi = async (googleData) => {
  const response = await api.post("/auth/google", googleData);
  return response.data;
};

export const requestAadhaarOtpApi = async (reqData) => {
  const response = await api.post("/auth/request-aadhaar-otp", reqData);
  return response.data;
};

export const verifyAadhaarOtpApi = async (otpData) => {
  const response = await api.post("/auth/verify-aadhaar-otp", otpData);
  return response.data;
};

export const sendSecurityEmailApi = async (emailData) => {
  const response = await api.post("/auth/send-security-email", emailData);
  return response.data;
};

export const forgotSecurityKeyApi = async (data) => {
  const response = await api.post("/auth/forgot-security-key", data);
  return response.data;
};

export const updateVendorStatusApi = async (statusData) => {
  const response = await api.patch("/auth/vendor-status", statusData);
  return response.data;
};

// Analytics & Dashboard Stats API
export const getAnalyticsSummary = async () => {
  const response = await api.get("/analytics/summary");
  return response.data;
};

export const getVendorAnalytics = async () => {
  const response = await api.get("/analytics/vendor-analytics");
  return response.data;
};

export const getSalesCharts = async () => {
  const response = await api.get("/analytics/sales-charts");
  return response.data;
};

// Global Transactions API
export const getTransactions = async () => {
  const response = await api.get("/transactions/");
  return response.data;
};

export const createTransaction = async (txData) => {
  const response = await api.post("/transactions/", txData);
  return response.data;
};

// Vendors API
export const getVendors = async () => {
  const response = await api.get("/vendors/");
  return response.data;
};

export const getVendor = async (vendorId) => {
  const response = await api.get(`/vendors/${vendorId}`);
  return response.data;
};

export const registerVendor = async (vendorData) => {
  const response = await api.post("/vendors/register", vendorData);
  return response.data;
};

export const updateVendor = async (vendorId, vendorData) => {
  const response = await api.put(`/vendors/${vendorId}`, vendorData);
  return response.data;
};

export const deleteVendor = async (vendorId) => {
  const response = await api.delete(`/vendors/${vendorId}`);
  return response.data;
};

// Customers API
export const getCustomers = async () => {
  const response = await api.get("/customers/");
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await api.post("/customers/", customerData);
  return response.data;
};

export const updateCustomer = async (customerId, customerData) => {
  const response = await api.put(`/customers/${customerId}`, customerData);
  return response.data;
};

export const deleteCustomer = async (customerId) => {
  const response = await api.delete(`/customers/${customerId}`);
  return response.data;
};

// Products API
export const getProducts = async () => {
  const response = await api.get("/products/");
  return response.data;
};

export const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products/", productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

// Health Check
export const checkHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.status === 200 && response.data?.status === "online";
  } catch {
    try {
      const fallback = await api.get("/");
      return fallback.status === 200;
    } catch {
      return false;
    }
  }
};

export default api;