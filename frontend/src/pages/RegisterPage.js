import { useState } from 'react';
import { registerUser } from '../services/authApi';

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
    --card-bg: rgba(255,255,255,0.035);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .noise {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
  }

  .glow-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .glow-blob.g1 {
    width: 500px; height: 500px;
    background: rgba(200,245,66,0.07);
    top: -100px; left: -100px;
    animation: drift1 12s ease-in-out infinite alternate;
  }
  .glow-blob.g2 {
    width: 400px; height: 400px;
    background: rgba(66,245,200,0.06);
    bottom: -80px; right: -80px;
    animation: drift2 14s ease-in-out infinite alternate;
  }

  @keyframes drift1 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(80px,60px) scale(1.2); }
  }
  @keyframes drift2 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(-60px,-40px) scale(1.15); }
  }

  /* ── NAV ── */
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

  /* ── AUTH CONTAINER ── */
  .auth-container {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 24px 60px;
  }

  .auth-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 48px;
    max-width: 480px;
    width: 100%;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.8s 0.2s ease forwards;
    opacity: 0;
  }
  .auth-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
  }

  .auth-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }

  .auth-subtitle {
    color: var(--muted);
    font-size: 0.95rem;
    font-weight: 300;
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-field label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text);
    display: block;
  }

  .form-field input {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .form-field input::placeholder {
    color: rgba(240,240,240,0.3);
  }

  .form-field input:focus {
    outline: none;
    border-color: var(--accent);
    background: rgba(255,255,255,0.08);
    box-shadow: 0 0 0 3px rgba(200,245,66,0.1);
  }

  .auth-submit {
    background: var(--accent);
    color: #0a0a0f;
    border: none;
    border-radius: 10px;
    padding: 12px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;
  }

  .auth-submit:hover:not(:disabled) {
    background: #d4f75a;
    box-shadow: 0 0 24px rgba(200,245,66,0.35);
    transform: translateY(-1px);
  }

  .auth-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .auth-error {
    background: rgba(255,59,48,0.1);
    border: 1px solid rgba(255,59,48,0.3);
    color: #ff6b6b;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 0.85rem;
    margin-bottom: 16px;
  }

  .auth-switch {
    text-align: center;
    font-size: 0.9rem;
    color: var(--muted);
  }

  .auth-link {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
    cursor: pointer;
  }

  .auth-link:hover {
    color: #d4f75a;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    nav { padding: 16px 20px; }
    .auth-card { padding: 32px 24px; }
    .auth-title { font-size: 1.6rem; }
  }
`;

function RegisterPage({ onNavigate }) {
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        username: form.username,
        name: form.fullName,
        email: form.email,
        password: form.password,
      });

      alert('Registration successful. Please login.');
      onNavigate('/login');
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="noise" />
      <div className="glow-blob g1" />
      <div className="glow-blob g2" />

      {/* NAV */}
      <nav>
        <div className="logo" onClick={() => onNavigate('/')}>
          <span>Parse<span className="logo-dot">.</span>AI</span>
          <span className="logo-badge">Beta</span>
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={() => onNavigate('/')}>
            Home
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('/login')}>
            Login
          </button>
        </div>
      </nav>

      {/* AUTH FORM */}
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Create your account ✨</h1>
          <p className="auth-subtitle">
            Start using AI-powered resume parsing to shortlist candidates faster.
          </p>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="register-username">Username</label>
              <input
                id="register-username"
                type="text"
                name="username"
                placeholder="jane_doe"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="register-full-name">Full name</label>
              <input
                id="register-full-name"
                type="text"
                name="fullName"
                placeholder="Jane Doe"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="register-confirm-password">Confirm password</label>
              <input
                id="register-confirm-password"
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                autoComplete="new-password"
                minLength={8}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <button
              className="auth-link"
              style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit'}}
              onClick={() => onNavigate('/login')}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
