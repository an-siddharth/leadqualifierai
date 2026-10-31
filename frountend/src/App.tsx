import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import LeadsTable from "./components/LeadsTable";
import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />
        <Dashboard />
      </main>
      <LeadsTable />
    </div>
  );
}

export default App;
