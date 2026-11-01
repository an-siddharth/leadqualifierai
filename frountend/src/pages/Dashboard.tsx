import { useEffect, useState } from "react";
import { Users, TrendingUp, MailCheck, Clock } from "lucide-react";
import StatCard from "../components/StatCard";
import LeadsTable from "../components/LeadsTable";
import "./Dashboard.css";

interface DashboardStats {
  total_leads: number;
  high_priority: number;
  pending_approvals: number;
  emails_sent: number;
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/dashboard/stats"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data: DashboardStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="dashboard">
      <div className="stats-grid">
        <StatCard
          title="Total Leads"
          value={stats?.total_leads ?? 0}
          icon={Users}
          description="All leads in your CRM"
          color="#60a5fa"
        />

        <StatCard
          title="High Priority"
          value={stats?.high_priority ?? 0}
          icon={TrendingUp}
          description="Leads scoring 75 or above"
          color="#34d399"
        />

        <StatCard
          title="Pending Approvals"
          value={stats?.pending_approvals ?? 0}
          icon={Clock}
          description="Emails awaiting your review"
          color="#fbbf24"
        />

        <StatCard
          title="Emails Sent"
          value={stats?.emails_sent ?? 0}
          icon={MailCheck}
          description="Successfully sent emails"
          color="#a78bfa"
        />
      </div>

      <LeadsTable />
    </section>
  );
}

export default Dashboard;
