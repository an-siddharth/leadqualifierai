import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import "./LeadsTable.css";

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

function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/leads");

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data: Lead[] = await response.json();
        setLeads(data);
      } catch (err) {
        setError("Unable to load leads. Check your backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) return <p>Loading leads...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="leads-section">
      <div className="leads-section-header">
        <div>
          <h2>Recent Leads</h2>
          <p>Latest leads from your CRM database</p>
        </div>

        <button className="view-all-button">
          View All <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="leads-table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>LEAD</th>
              <th>SERVICE</th>
              <th>AI SCORE</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div className="lead-identity">
                    <strong>{lead.name}</strong>
                    <span>{lead.email}</span>
                    <small>{lead.company}</small>
                  </div>
                </td>

                <td>{lead.service}</td>

                <td>
                  <strong className="lead-score">
                    {lead.score !== null ? `${lead.score}/100` : "—"}
                  </strong>
                </td>

                <td>
                  <span className={`priority-badge ${lead.category ?? ""}`}>
                    {lead.category ?? "Not analyzed"}
                  </span>
                </td>

                <td>
                  <span className="lead-status">{lead.status}</span>
                </td>
              </tr>
            ))}

            {leads.length === 0 && (
              <tr>
                <td colSpan={5}>No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default LeadsTable;
