import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import "../styles/statscard.css";

function StatsCard({ title, value, icon, color = "#2563EB", change = "+12.5%", isPositive = true }) {
  return (
    <div className="stats-card">
      <div className="stats-left">
        <p className="stats-title">{title}</p>
        <h2 className="stats-value">{value}</h2>
        <div className={`stats-trend ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
          <span>{change} vs last month</span>
        </div>
      </div>

      <div
        className="stats-icon-wrapper"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}DD)`,
          boxShadow: `0 4px 14px ${color}40`
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default StatsCard;