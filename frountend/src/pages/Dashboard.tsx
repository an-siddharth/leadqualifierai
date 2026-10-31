import { Users, TrendingUp, MailCheck, Clock } from "lucide-react";
import StatCard from "../components/StatCard";
import "./Dashboard.css";

function Dashboard() {
  return (
    <section className="dashboard">
      <div className="stats-grid">
        <StatCard
          title="Total Leads"
          value={128}
          icon={Users}
          description="All leads in your CRM"
          color="#60a5fa"
        />

        <StatCard
          title="High Priority"
          value={32}
          icon={TrendingUp}
          description="Leads scoring 75 or above"
          color="#34d399"
        />

        <StatCard
          title="Pending Approvals"
          value={8}
          icon={Clock}
          description="Emails awaiting your review"
          color="#fbbf24"
        />

        <StatCard
          title="Emails Sent"
          value={76}
          icon={MailCheck}
          description="Successfully sent emails"
          color="#a78bfa"
        />
      </div>
    </section>
  );
}

export default Dashboard;
