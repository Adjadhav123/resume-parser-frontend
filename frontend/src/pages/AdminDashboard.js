import { useState, useEffect, useCallback } from 'react';
import { getAllJobs, createJob, updateJob, deleteJob, getAllApplications, updateApplicationStatus } from '../services/authApi';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --border: rgba(255,255,255,0.07);
    --accent: #c8f542;
    --accent2: #42f5c8;
    --text: #f0f0f0;
    --muted: rgba(240,240,240,0.45);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 48px;
    background: rgba(10,10,15,0.75);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }

  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.3rem;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  .logo-dot { color: var(--accent); }
  .logo-badge {
    font-size: 0.6rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    background: rgba(200,245,66,0.12);
    color: var(--accent);
    border: 1px solid rgba(200,245,66,0.25);
    padding: 2px 8px;
    border-radius: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .nav-actions { display: flex; gap: 12px; align-items: center; }

  .btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 10px 22px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.2px;
    text-decoration: none;
    display: inline-block;
    border: none;
  }
  .btn-ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover {
    border-color: rgba(255,255,255,0.2);
    color: var(--text);
  }
  .btn-primary {
    background: var(--accent);
    color: #0a0a0f;
    border: 1px solid var(--accent);
    font-weight: 600;
  }
  .btn-primary:hover {
    background: #d4f75a;
    box-shadow: 0 0 24px rgba(200,245,66,0.35);
    transform: translateY(-1px);
  }

  .btn-danger {
    background: rgba(255,59,48,0.15);
    color: #ff6b6b;
    border: 1px solid rgba(255,59,48,0.3);
  }
  .btn-danger:hover {
    background: rgba(255,59,48,0.25);
  }

  .btn-secondary {
    background: rgba(100,200,255,0.15);
    color: #64c8ff;
    border: 1px solid rgba(100,200,255,0.3);
  }
  .btn-secondary:hover {
    background: rgba(100,200,255,0.25);
  }

  .btn-sm {
    padding: 6px 14px;
    font-size: 0.8rem;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 24px 40px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -1px;
  }

  .jobs-grid {
    display: grid;
    gap: 20px;
    margin-bottom: 40px;
  }

  .job-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 15px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .job-card:hover {
    border-color: var(--accent);
    box-shadow: 0 8px 32px rgba(200,245,66,0.1);
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 16px;
  }

  .job-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .job-company {
    color: var(--muted);
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  .job-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .meta-label {
    color: var(--muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .meta-value {
    color: var(--accent);
    font-weight: 600;
  }

  .job-description {
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 12px;
  }

  .job-skills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .skill-tag {
    background: rgba(200,245,66,0.1);
    color: var(--accent);
    border: 1px solid rgba(200,245,66,0.2);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .job-actions {
    display: flex;
    gap: 10px;
  }

  .modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 200;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .modal-overlay.active {
    display: flex;
  }

  .modal-content {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 15px;
    padding: 32px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 20px;
  }

  .modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    border: none;
    color: var(--muted);
    font-size: 1.5rem;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .form-field label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
  }

  .form-field input,
  .form-field textarea {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .form-field input:focus,
  .form-field textarea:focus {
    outline: none;
    border-color: var(--accent);
    background: rgba(255,255,255,0.08);
    box-shadow: 0 0 0 3px rgba(200,245,66,0.1);
  }

  .form-field textarea {
    resize: vertical;
    min-height: 80px;
    font-family: 'DM Sans', sans-serif;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  .empty-state {
    text-align: center;
    padding: 60px 24px;
    color: var(--muted);
  }

  .empty-state h2 {
    font-size: 1.5rem;
    margin-bottom: 12px;
    color: var(--text);
  }

  .success-msg {
    background: rgba(76,175,80,0.1);
    border: 1px solid rgba(76,175,80,0.3);
    color: #4caf50;
    padding: 12px 16px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 0.9rem;
  }

  .error-msg {
    background: rgba(255,59,48,0.1);
    border: 1px solid rgba(255,59,48,0.3);
    color: #ff6b6b;
    padding: 12px 16px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 0.9rem;
  }

  .tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0;
  }

  .tab {
    background: transparent;
    border: none;
    color: var(--muted);
    padding: 12px 20px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 2px solid transparent;
    position: relative;
    bottom: -1px;
  }

  .tab:hover {
    color: var(--text);
  }

  .tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }

  .application-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 15px;
    padding: 24px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .application-card:hover {
    border-color: var(--accent);
    box-shadow: 0 8px 32px rgba(200,245,66,0.1);
  }

  .application-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 16px;
  }

  .candidate-name {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .candidate-email {
    color: var(--muted);
    font-size: 0.9rem;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .status-applied {
    background: rgba(100,200,255,0.15);
    color: #64c8ff;
  }

  .status-interviewing {
    background: rgba(255,193,7,0.15);
    color: #ffc107;
  }

  .status-rejected {
    background: rgba(255,59,48,0.15);
    color: #ff6b6b;
  }

  .status-accepted {
    background: rgba(76,175,80,0.15);
    color: #4caf50;
  }

  .application-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .meta-item-app {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .meta-label-app {
    color: var(--muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .meta-value-app {
    color: var(--text);
    font-weight: 600;
  }

  .resume-section {
    background: rgba(200,245,66,0.05);
    border: 1px solid rgba(200,245,66,0.1);
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 16px;
  }

  .resume-title {
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  .resume-content {
    color: var(--text);
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .application-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .status-select {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 12px;
    color: var(--text);
    font-size: 0.85rem;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  .status-select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(200,245,66,0.1);
  }

  @media (max-width: 640px) {
    nav { padding: 16px 20px; }
    .container { padding: 100px 16px 30px; }
    .header { flex-direction: column; gap: 16px; }
    .modal-content { padding: 24px; }
    .tabs { flex-wrap: wrap; }
    .application-meta { grid-template-columns: 1fr; }
    .application-actions { flex-direction: column; }
  }
`;

function AdminDashboard({ onNavigate }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [currentTab, setCurrentTab] = useState('jobs');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    location: '',
    description: '',
    required_skills: '',
    experience_years: '',
    salary_range: '',
    job_type: 'Full-time',
    status: 'open',
  });

  const token = localStorage.getItem('admin_token');

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllJobs(token);
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllApplications(token);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      onNavigate('/admin/login');
      return;
    }
    if (currentTab === 'jobs') {
      fetchJobs();
    } else if (currentTab === 'applications') {
      fetchApplications();
    }
  }, [token, currentTab, fetchJobs, fetchApplications, onNavigate]);

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingId(job.job_id);
      setFormData({
        job_title: job.job_title,
        company_name: job.company_name,
        location: job.location,
        description: job.description,
        required_skills: job.required_skills.join(', '),
        experience_years: job.experience_years,
        salary_range: job.salary_range,
        job_type: job.job_type,
        status: job.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        job_title: '',
        company_name: '',
        location: '',
        description: '',
        required_skills: '',
        experience_years: '',
        salary_range: '',
        job_type: 'Full-time',
        status: 'active',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const jobData = {
        job_title: formData.job_title,
        company_name: formData.company_name,
        location: formData.location,
        description: formData.description,
        required_skills: formData.required_skills.split(',').map((s) => s.trim()),
        experience_years: parseInt(formData.experience_years),
        salary_range: formData.salary_range,
        job_type: formData.job_type,
        status: formData.status,
      };

      if (editingId) {
        await updateJob(editingId, jobData, token);
        // Optimistic update - update local state immediately
        setJobs((prevJobs) => 
          prevJobs.map((job) => 
            job.job_id === editingId 
              ? { ...job, ...jobData }
              : job
          )
        );
        setMessage('Job updated successfully!');
      } else {
        const response = await createJob(jobData, token);
        setJobs((prevJobs) => [...prevJobs, response]);
        setMessage('Job created successfully!');
      }

      handleCloseModal();
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save job');
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        setError('');
        await deleteJob(jobId, token);
        // Optimistic update - remove from local state immediately
        setJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== jobId));
        setMessage('Job deleted successfully!');
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete job');
        // Clear error after 5 seconds and refresh jobs
        setTimeout(() => setError(''), 5000);
        await fetchJobs();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onNavigate('/admin/login');
  };

  return (
    <>
      <style>{styles}</style>

      <nav>
        <div className="logo" onClick={() => onNavigate('/')}>
          <span>Parse<span className="logo-dot">.</span>AI</span>
          <span className="logo-badge">Admin</span>
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={() => onNavigate('/')}>
            Home
          </button>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="header">
          <h1>{currentTab === 'jobs' ? 'Job Management' : 'Job Applications'} 💼</h1>
          {currentTab === 'jobs' && (
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              + New Job
            </button>
          )}
        </div>

        <div className="tabs">
          <button
            className={`tab ${currentTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setCurrentTab('jobs')}
          >
            All Jobs
          </button>
          <button
            className={`tab ${currentTab === 'applications' ? 'active' : ''}`}
            onClick={() => setCurrentTab('applications')}
          >
            Applications
          </button>
        </div>

        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

        {currentTab === 'jobs' ? (
          // Jobs Tab
          <>
            {loading ? (
              <div className="empty-state">
                <h2>Loading jobs...</h2>
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <h2>No jobs yet</h2>
                <p>Create your first job posting to get started!</p>
              </div>
            ) : (
              <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job.job_id} className="job-card">
                <div className="job-header">
                  <div>
                    <h3 className="job-title">{job.job_title}</h3>
                    <p className="job-company">{job.company_name}</p>
                  </div>
                  <span className="skill-tag">{job.status}</span>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <span className="meta-label">Location</span>
                    <span className="meta-value">{job.location}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Experience</span>
                    <span className="meta-value">{job.experience_years} yrs</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Salary</span>
                    <span className="meta-value">{job.salary_range}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Type</span>
                    <span className="meta-value">{job.job_type}</span>
                  </div>
                </div>

                <p className="job-description">{job.description}</p>

                <div className="job-skills">
                  {job.required_skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="job-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleOpenModal(job)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteJob(job.job_id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
              </div>
            )}
          </>
        ) : (
          // Applications Tab
          <>
            {loading ? (
              <div className="empty-state">
                <h2>Loading applications...</h2>
              </div>
            ) : applications.length === 0 ? (
              <div className="empty-state">
                <h2>No applications yet</h2>
                <p>Job applications will appear here.</p>
              </div>
            ) : (
              <div>
                {applications.map((app) => (
                  <div key={app.application_id} className="application-card">
                    <div className="application-header">
                      <div>
                        <div className="candidate-name">{app.candidate_info?.name}</div>
                        <div className="candidate-email">{app.candidate_info?.email}</div>
                      </div>
                      <span className={`status-badge status-${app.status}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="application-meta">
                      <div className="meta-item-app">
                        <span className="meta-label-app">Position</span>
                        <span className="meta-value-app">{app.job_info?.job_title}</span>
                      </div>
                      <div className="meta-item-app">
                        <span className="meta-label-app">Company</span>
                        <span className="meta-value-app">{app.job_info?.company_name}</span>
                      </div>
                      <div className="meta-item-app">
                        <span className="meta-label-app">Location</span>
                        <span className="meta-value-app">{app.job_info?.location}</span>
                      </div>
                      <div className="meta-item-app">
                        <span className="meta-label-app">Applied On</span>
                        <span className="meta-value-app">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {app.resume_info && (
                      <div className="resume-section">
                        <div className="resume-title">📄 Candidate Resume</div>
                        <div className="resume-content">
                          <strong>Name:</strong> {app.resume_info.name} <br />
                          <strong>Email:</strong> {app.resume_info.email} <br />
                          {app.resume_info.phone && (
                            <>
                              <strong>Phone:</strong> {app.resume_info.phone} <br />
                            </>
                          )}
                          {app.resume_info.experience_years && (
                            <>
                              <strong>Experience:</strong> {app.resume_info.experience_years} years <br />
                            </>
                          )}
                          {app.resume_info.skills && (
                            <>
                              <strong>Skills:</strong> {app.resume_info.skills} <br />
                            </>
                          )}
                          {app.resume_info.education && (
                            <>
                              <strong>Education:</strong> {app.resume_info.education}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="application-actions">
                      <select
                        className="status-select"
                        value={app.status}
                        onChange={async (e) => {
                          try {
                            await updateApplicationStatus(app.application_id, e.target.value, token);
                            setMessage('Application status updated!');
                            await fetchApplications();
                            setTimeout(() => setMessage(''), 3000);
                          } catch (err) {
                            setError('Failed to update status: ' + err.message);
                            setTimeout(() => setError(''), 5000);
                          }
                        }}
                      >
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className={`modal-overlay ${showModal ? 'active' : ''}`} onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleCloseModal}>
            ✕
          </button>
          <h2 className="modal-title">{editingId ? 'Edit Job' : 'Create New Job'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Job Title *</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Backend Developer"
                required
              />
            </div>

            <div className="form-field">
              <label>Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="Your Company Name"
                required
              />
            </div>

            <div className="form-field">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Pune, India"
                required
              />
            </div>

            <div className="form-field">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Job description..."
                required
              />
            </div>

            <div className="form-field">
              <label>Required Skills *</label>
              <input
                type="text"
                name="required_skills"
                value={formData.required_skills}
                onChange={handleInputChange}
                placeholder="e.g., Python, FastAPI, SQL"
                required
              />
            </div>

            <div className="form-field">
              <label>Experience (years) *</label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleInputChange}
                placeholder="e.g., 3"
                required
              />
            </div>

            <div className="form-field">
              <label>Salary Range</label>
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleInputChange}
                placeholder="e.g., 6-10 LPA"
              />
            </div>

            <div className="form-field">
              <label>Job Type *</label>
              <input
                type="text"
                name="job_type"
                value={formData.job_type}
                onChange={handleInputChange}
                placeholder="e.g., Full-time"
                required
              />
            </div>

            <div className="form-field">
              <label>Status *</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                placeholder="e.g., open, closed, draft"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
