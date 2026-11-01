import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import "./LeadsDetails.css";

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  budget: number;
  service: string;
  urgency: string;
  requirements: string;
  score: number | null;
  category: string | null;
  status: string;
  email_status: string;
  email_subject: string | null;
  email_body: string | null;
}

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/leads/${id}`
        );

        if (!response.ok) {
          throw new Error("Lead not found");
        }

        const data: Lead = await response.json();
        setLead(data);
      } catch (err) {
        setError("Unable to load lead details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  if (loading) return <div className="lead-details-page">Loading...</div>;

  if (error || !lead) {
    return (
      <div className="lead-details-page">
        <p>{error || "Lead not found."}</p>
        <button onClick={() => navigate("/leads")}>Back to Leads</button>
      </div>
    );
  }

  return (
    <section className="lead-details-page">
      <button className="back-button" onClick={() => navigate("/leads")}>
        <ArrowLeft size={17} />
        Back to Leads
      </button>

      <div className="lead-details-heading">
        <div>
          <h2>{lead.name}</h2>
          <p>{lead.company}</p>
        </div>

        <span className={`lead-category ${lead.category || ""}`}>
          {lead.category || "Not analyzed"}
        </span>
      </div>

      <div className="lead-details-grid">
        <div className="details-card">
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Company:</strong> {lead.company}</p>
          <p><strong>Service:</strong> {lead.service}</p>
          <p><strong>Budget:</strong> ₹{lead.budget.toLocaleString("en-IN")}</p>
          <p><strong>Urgency:</strong> {lead.urgency}</p>
        </div>

        <div className="details-card">
          <h3>AI Qualification</h3>
          <div className="details-score">
            {lead.score !== null ? `${lead.score}/100` : "Not analyzed"}
          </div>
          <p><strong>Category:</strong> {lead.category || "N/A"}</p>
          <p><strong>Lead Status:</strong> {lead.status}</p>
          <p><strong>Email Status:</strong> {lead.email_status}</p>
        </div>

        <div className="details-card full-width">
          <h3>Requirements</h3>
          <p>{lead.requirements}</p>
        </div>

        <div className="details-card full-width">
          <h3>Email Draft</h3>

          {lead.email_subject || lead.email_body ? (
            <>
              <p><strong>Subject:</strong> {lead.email_subject || "N/A"}</p>
              <div className="email-body">{lead.email_body || "No email body."}</div>
            </>
          ) : (
            <p>No email draft available.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default LeadDetails;
