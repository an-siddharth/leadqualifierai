import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import "./CreateLead.css";

interface LeadForm {
  name: string;
  email: string;
  company: string;
  budget: string;
  service: string;
  urgency: "low" | "medium" | "high";
  requirements: string;
}

function CreateLead() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LeadForm>({
    name: "",
    email: "",
    company: "",
    budget: "",
    service: "",
    urgency: "medium",
    requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create lead."
        );
      }

      navigate(`/leads/${data.lead_id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-lead-page">
      <button
        className="create-back-button"
        onClick={() => navigate("/leads")}
      >
        <ArrowLeft size={17} />
        Back to Leads
      </button>

      <div className="create-lead-heading">
        <h2>Add New Lead</h2>
        <p>Enter lead information for AI-powered qualification.</p>
      </div>

      <form className="create-lead-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company name"
              required
            />
          </div>

          <div className="form-group">
            <label>Budget (₹)</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="Enter budget"
              min="0.01"
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label>Service Required</label>
            <input
              name="service"
              value={form.service}
              onChange={handleChange}
              placeholder="e.g. Website Development"
              required
            />
          </div>

          <div className="form-group">
            <label>Urgency</label>
            <select
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Requirements</label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              placeholder="Describe the lead's requirements..."
              rows={5}
              required
            />
          </div>
        </div>

        {error && <p className="create-lead-error">{error}</p>}

        <div className="create-form-actions">
          <button
            type="button"
            className="cancel-lead-button"
            onClick={() => navigate("/leads")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-lead-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={17} className="loading-icon" />
                Processing...
              </>
            ) : (
              "Create & Qualify Lead"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateLead;
