import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";

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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;