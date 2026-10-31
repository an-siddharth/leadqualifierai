
import { Search, Bell, CircleUserRound } from "lucide-react";
import "./Header.css";

function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your leads.</p>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={18} />
          <input type="text" placeholder="Search anything..." />
        </div>

        <button className="notification-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <CircleUserRound size={34} />
          <div>
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
