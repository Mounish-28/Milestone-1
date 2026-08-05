import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import "../styles/charts.css";

const revenueData = [
  { month: "Jan", revenue: 32400, orders: 1420 },
  { month: "Feb", revenue: 41200, orders: 1850 },
  { month: "Mar", revenue: 53800, orders: 2310 },
  { month: "Apr", revenue: 49100, orders: 2040 },
  { month: "May", revenue: 64500, orders: 2890 },
  { month: "Jun", revenue: 78900, orders: 3410 },
  { month: "Jul", revenue: 89400, orders: 3950 },
];

const categoryData = [
  { name: "Electronics", value: 42, color: "#2563EB" },
  { name: "Fashion & Apparel", value: 28, color: "#10B981" },
  { name: "Home & Living", value: 18, color: "#F59E0B" },
  { name: "Sports & Beauty", value: 12, color: "#8B5CF6" },
];

function DashboardCharts() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const strokeColor = isDark ? "#374151" : "#E2E8F0";
  const textColor = isDark ? "#9CA3AF" : "#64748B";
  const tooltipBg = isDark ? "#1F2937" : "#FFFFFF";
  const tooltipText = isDark ? "#F9FAFB" : "#0F172A";

  return (
    <div className="chart-grid">
      {/* Revenue & Growth Area Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Revenue & Performance Trends</h3>
            <p className="chart-subtitle">Monthly sales revenue growth over time</p>
          </div>
          <span className="badge badge-success">+24.8% YoY Growth</span>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                color: tooltipText,
                borderRadius: "8px",
                border: `1px solid ${strokeColor}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}
              formatter={(val) => [`$${val.toLocaleString()}`, "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Product Categories Pie Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Marketplace Distribution</h3>
            <p className="chart-subtitle">Sales by product category</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                color: tooltipText,
                borderRadius: "8px",
                border: `1px solid ${strokeColor}`
              }}
              formatter={(val) => [`${val}%`, "Share"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span style={{ color: textColor, fontSize: 12, fontWeight: 500 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardCharts;