import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";

const avatars = [
  { initials: "JD", color: "#7000ff" },
  { initials: "SK", color: "#00c2ff" },
];

const Home = () => {
  const navigate = useNavigate();
  const { loading, generateReport, reports, getAllReports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [fileReady, setFileReady] = useState(false);

  const [formError, setFormError] = useState(null);

  useEffect(() => { getAllReports() }, [])

  const handleJobDescriptionChange = (e) => setJobDescription(e.target.value);
  const handleSelfDescriptionChange = (e) => setSelfDescription(e.target.value);

  const handleGenerateReport = async () => {
    setFormError(null);
    const resumeFile = fileInputRef.current?.files[0];
    if (!resumeFile)       { setFormError("Please upload a resume PDF."); return; }
    if (!jobDescription.trim()) { setFormError("Please enter the job description."); return; }
    if (!selfDescription.trim()) { setFormError("Please add your self description."); return; }
    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile });
      if (data?.reportId || data?._id) {
        navigate(`/interview/${data.reportId || data._id}`);
      } else {
        setFormError("Report generated but ID not found — please try again.");
      }
    } catch (error) {
      setFormError(error.response?.data?.message || error.message || "Failed to generate report.");
    }
  };

  const handleDropZoneClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) { setFileName(file.name); setFileReady(true); }
  };

  return (
    <div className="home-page-wrapper">
      <div className="orb orb-top-right" aria-hidden />

      {/* ── Top app-bar ── */}
      <nav className="home-appbar">
        <div className="home-appbar__brand">
          <div className="logo-icon" style={{ width: 28, height: 28, borderRadius: '0.5rem' }}>
            <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="logo-text gradient-text" style={{ fontSize: '0.9rem' }}>Resume Tailor</span>
        </div>
        <Link to="/interview" className="home-appbar__link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          My Reports
        </Link>
      </nav>

      <main className="home-container">
        <header className="hero">
          <div className="brand">
            <div className="logo-icon">
              <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="logo-text gradient-text">Resume Tailor</span>
          </div>

          <h2>
            Land your <span className="gradient-text">Dream</span>{" "}
            <span className="gradient-text-purple">Job</span>
            <br />
            with AI-Powered Precision.
          </h2>
          <p className="subtitle">
            Our advanced neural engine meticulously realigns your experience with job descriptions,
            ensuring you bypass ATS filters and catch every recruiter&apos;s eye.
          </p>
        </header>

        <section className="workspace">
          {/* Left: Job Description */}
          <div className="left-section">
            <div className="textarea-container focus-glow-container">
              <div className="card-top-bar">
                <div className="card-icon-wrap">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <label className="section-label" htmlFor="job-description">
                  Job Opportunity
                </label>
                <span className="step-label step-label-right">STEP 1: DEFINE TARGET</span>
              </div>
              <textarea
                id="job-description"
                name="jobDescription"
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                placeholder="Paste the target job description here. Mention key skills, responsibilities, and specific requirements..."
              />
            </div>
          </div>

          {/* Right: Action card */}
          <div className="right-section">
            <div className="inputs-card">
              <div className="card-header-row">
                <span className="step-label">STEP 2 &amp; 3: YOUR PROFILE</span>
                <div className="card-header-dashes">
                  <span className="dash" />
                  <span className="dash" />
                </div>
              </div>

              <div className="input-group">
                <h3 className="input-heading">
                  <span className="dot cyan" />
                  Current Resume
                </h3>
                <div className="drop-zone-wrap">
                  <div className="crawling-border-box drop-zone-overlay" aria-hidden />
                  <div
                    className="drop-zone"
                    role="button"
                    tabIndex={0}
                    onClick={handleDropZoneClick}
                    onKeyDown={(e) => e.key === "Enter" && handleDropZoneClick()}
                  >
                    <div className="drop-icon-circle">
                      <svg className="drop-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="drop-label">{fileName || "Drop PDF or Docx"}</p>
                    <p className="drop-hint">{fileReady ? "Ready for analysis" : "Cloud processing secured"}</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden-input"
                      onChange={handleFileChange}
                      aria-label="Upload resume"
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <h3 className="input-heading">
                  <span className="dot purple" />
                  Self Description
                  <span className="badge-tag">Enhancement</span>
                </h3>
                <textarea
                  id="self-description"
                  name="selfDescription"
                  value={selfDescription}
                  onChange={handleSelfDescriptionChange}
                  placeholder="Add your Self Description"
                  rows={4}
                />
              </div>

              <button
                type="button"
                className="generate-btn"
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? (
                  <><div className="generate-btn__spinner" /><span className="btn-text">Generating…</span></>
                ) : (
                  <><span className="btn-text">Generate Final Draft</span><span className="btn-dot" /></>
                )}
              </button>

              {formError && (
                <div className="form-error">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {formError}
                </div>
              )}
{/*Recent Reports*/}
{reports?.length > 0 && (
  <div className="recent-reports">
    <h3 className="recent-reports__title">Recent Reports</h3>
    <ul className="recent-reports__list">
      {reports.slice(0, 5).map((r) => (
        <li
          key={r._id}
          className="recent-reports__item"
          onClick={() => navigate(`/interview/${r._id}`)}
        >
          <span className="recent-reports__item-title">{r.title || 'Interview Report'}</span>
          <span className={`recent-reports__score ${
            r.matchScore >= 80 ? 'score--high' : r.matchScore >= 60 ? 'score--mid' : 'score--low'
          }`}>{r.matchScore ?? '–'}%</span>
        </li>
      ))}
    </ul>
  </div>
)}
              <div className="trust-footer">
                <div className="avatar-stack">
                  {avatars.map((a) => (
                    <div key={a.initials} className="avatar" style={{ background: a.color }}>
                      {a.initials}
                    </div>
                  ))}
                  <div className="avatar avatar-count">+9</div>
                </div>
                <p className="trust-text">
                  Verified by <strong>50+ ATS protocols</strong> and enterprise-grade career models.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="status-footer">
          <span className="status-left">
            <span className="status-dot" />
            Neural Engine: v2.4.0-Stable
          </span>
          <div className="status-links">
            <a href="#privacy">Privacy</a>
            <a href="#support">Support</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;