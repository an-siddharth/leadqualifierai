import {
  LayoutDashboard,
  Users,
  MailCheck,
  Settings,
  Bot
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Bot size={24} />
        </div>
        <span>LeadQualifier<span className="logo-highlight">AI</span></span>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">MENU</p>

        <nav className="sidebar-nav">
          <a href="#" className="sidebar-link active">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>

          <a href="#" className="sidebar-link">
            <Users size={19} />
            <span>All Leads</span>
          </a>

          <a href="#" className="sidebar-link">
            <MailCheck size={19} />
            <span>Email Approvals</span>
          </a>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <a href="#" className="sidebar-link">
          <Settings size={19} />
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;
