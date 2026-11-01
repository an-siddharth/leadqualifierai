
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Approvals from "./pages/Approvals";
import LeadDetails from "./pages/LeadsDetails";
import CreateLead from "./pages/CreateLead";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Header />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/new" element={<CreateLead />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route path="/approvals" element={<Approvals />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
