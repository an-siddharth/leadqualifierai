import {
  LayoutDashboard,
  Users,
  MailCheck,
  Settings,
  Bot,
  Plus
} from "lucide-react";

import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Bot size={24} />
        </div>
        <span>
          LeadQualifier<span className="logo-highlight">AI</span>
        </span>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">MENU</p>

        <nav className="sidebar-nav">
          <NavLink to="/" end className="sidebar-link">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/leads" className="sidebar-link">
            <Users size={19} />
            <span>All Leads</span>
          </NavLink>

          <NavLink to="/leads/new" className="sidebar-link">
            <Plus size={19} />
            <span>Add New Lead</span>
          </NavLink>

          <NavLink to="/approvals" className="sidebar-link">
            <MailCheck size={19} />
            <span>Email Approvals</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <NavLink to="/settings" className="sidebar-link">
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
