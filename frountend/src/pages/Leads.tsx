import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import "./Leads.css";

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  service: string;
  score: number | null;
  category: "high" | "medium" | "low" | null;
  status: string;
}

function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/leads");

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data: Lead[] = await response.json();
        setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) =>
    `${lead.name} ${lead.email} ${lead.company}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="leads-page">
      <div className="leads-page-heading">
        <div>
          <h2>All Leads</h2>
          <p>Manage and track all your business leads.</p>
        </div>

        <div className="leads-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="leads-page-table">
        {loading ? (
          <p className="leads-message">Loading leads...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Service</th>
                  <th>Score</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-name">{lead.name}</div>
                      <div className="lead-email">{lead.email}</div>
                    </td>
                    <td>{lead.company}</td>
                    <td>{lead.service}</td>
                    <td>{lead.score ?? "—"}</td>
                    <td>
                      <span className={`lead-category ${lead.category ?? ""}`}>
                        {lead.category ?? "Not analyzed"}
                      </span>
                    </td>
                    <td>{lead.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <p className="leads-message">No leads found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Leads;