import type { LucideIcon } from "lucide-react";
import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  color: string;
}

function StatCard({ title, value, icon: Icon, description, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-title">{title}</span>
        <div className="stat-icon" style={{ color }}>
          <Icon size={21} />
        </div>
      </div>

      <h2 className="stat-value">{value}</h2>
      <p className="stat-description">{description}</p>
    </div>
  );
}

export default StatCard;
