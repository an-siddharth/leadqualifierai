import { useEffect, useState } from "react";
import "./Approvals.css";

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  service: string;
  score: number | null;
  category: string | null;
  email_status: string;
  email_subject: string | null;
  email_body: string | null;
}

function Approvals() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const API_URL = "http://localhost:8000";

  const fetchApprovals = async () => {
    try {
      const response = await fetch(`${API_URL}/api/leads`);

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data: Lead[] = await response.json();

      const pendingLeads = data.filter(
        (lead) => lead.email_status === "awaiting_approval"
      );

      setLeads(pendingLeads);

      if (selectedLead) {
        const updatedLead = pendingLeads.find(
          (lead) => lead.id === selectedLead.id
        );

        if (updatedLead) {
          setSelectedLead(updatedLead);
          setSubject(updatedLead.email_subject || "");
          setBody(updatedLead.email_body || "");
        } else {
          setSelectedLead(null);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to load pending approvals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const selectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setSubject(lead.email_subject || "");
    setBody(lead.email_body || "");
    setMessage("");
  };

  const handleAction = async (action: "edit" | "approve" | "reject") => {
    if (!selectedLead) return;

    if (action === "edit" && (!subject.trim() || !body.trim())) {
      setMessage("Subject and body cannot be empty.");
      return;
    }

    const confirmation =
      action === "approve"
        ? window.confirm("This will send a real email. Continue?")
        : action === "reject"
          ? window.confirm("Are you sure you want to reject this email?")
          : true;

    if (!confirmation) return;

    setProcessing(true);
    setMessage("");

    try {
      const payload: {
        action: string;
        subject?: string;
        body?: string;
      } = { action };

      if (action === "edit") {
        payload.subject = subject;
        payload.body = body;
      }

      const response = await fetch(
        `${API_URL}/api/leads/${selectedLead.id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Action failed");
      }

      setMessage(result.message || `Email ${action} successful.`);

      if (action !== "edit") {
        setSelectedLead(null);
        await fetchApprovals();
      } else {
        await fetchApprovals();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="approvals-page">Loading approvals...</div>;
  }

  return (
    <div className="approvals-page">
      <div className="approvals-heading">
        <div>
          <h2>Email Approvals</h2>
          <p>Review and manage AI-generated follow-up emails.</p>
        </div>

        <span>{leads.length} Pending</span>
      </div>

      {message && <div className="approval-message">{message}</div>}

      {leads.length === 0 ? (
        <div className="empty-approvals">
          <h3>No pending approvals</h3>
          <p>All email drafts have been processed.</p>
        </div>
      ) : (
        <div className="approvals-container">
          <div className="approval-leads">
            <h3>Pending Emails</h3>

            {leads.map((lead) => (
              <button
                className={`approval-lead ${
                  selectedLead?.id === lead.id ? "selected" : ""
                }`}
                key={lead.id}
                onClick={() => selectLead(lead)}
              >
                <strong>{lead.name}</strong>
                <span>{lead.company}</span>
                <small>
                  {lead.category || "Uncategorized"} · Score:{" "}
                  {lead.score ?? "N/A"}
                </small>
              </button>
            ))}
          </div>

          <div className="approval-editor">
            {!selectedLead ? (
              <div className="select-approval">
                Select a lead to review its email draft.
              </div>
            ) : (
              <>
                <div className="approval-contact">
                  <div>
                    <h3>{selectedLead.name}</h3>
                    <p>{selectedLead.email}</p>
                  </div>

                  <span>{selectedLead.company}</span>
                </div>

                <div className="approval-details">
                  <p>
                    <strong>Service:</strong> {selectedLead.service}
                  </p>
                  <p>
                    <strong>Lead Score:</strong> {selectedLead.score ?? "N/A"}
                  </p>
                </div>

                <label>Email Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                />

                <label>Email Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  placeholder="Email body"
                />

                <div className="approval-actions">
                  <button
                    onClick={() => handleAction("edit")}
                    disabled={processing}
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => handleAction("reject")}
                    disabled={processing}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleAction("approve")}
                    disabled={processing}
                  >
                    Approve & Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Approvals;
