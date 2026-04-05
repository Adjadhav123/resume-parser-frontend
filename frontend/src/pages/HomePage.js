import React, { useEffect, useRef } from "react";

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

  /* ── HERO ── */
  .hero {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 120px 24px 60px;
  }

  .hero-tag {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid rgba(200,245,66,0.25);
    background: rgba(200,245,66,0.07);
    padding: 6px 16px;
    border-radius: 20px;
    margin-bottom: 28px;
    opacity: 0;
    animation: fadeUp 0.8s 0.1s ease forwards;
  }

  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.8rem, 6vw, 5.5rem);
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -2px;
    max-width: 780px;
    opacity: 0;
    animation: fadeUp 0.8s 0.25s ease forwards;
  }

  .hero h1 em {
    font-style: normal;
    color: var(--accent);
    position: relative;
  }
  .hero h1 em::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 4px;
    height: 3px;
    background: var(--accent);
    border-radius: 2px;
    opacity: 0.4;
  }

  .hero-sub {
    margin-top: 22px;
    font-size: 1.05rem;
    color: var(--muted);
    max-width: 520px;
    line-height: 1.7;
    font-weight: 300;
    opacity: 0;
    animation: fadeUp 0.8s 0.4s ease forwards;
  }

  .hero-cta {
    margin-top: 40px;
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
    opacity: 0;
    animation: fadeUp 0.8s 0.55s ease forwards;
  }

  .btn-lg {
    padding: 14px 32px;
    font-size: 0.95rem;
    border-radius: 10px;
  }

  .hero-visual {
    margin-top: 70px;
    position: relative;
    width: min(680px, 90vw);
    opacity: 0;
    animation: fadeUp 0.9s 0.7s ease forwards;
  }

  .resume-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 32px;
    position: relative;
    overflow: hidden;
    text-align: left;
  }
  .resume-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
  }

  .rc-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--border);
  }
  .rc-avatar {
    width: 42px; height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1rem;
    color: #0a0a0f;
    flex-shrink: 0;
  }
  .rc-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
  }
  .rc-role { font-size: 0.78rem; color: var(--muted); margin-top: 2px; }

  .rc-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
  }
  .rc-tag {
    font-size: 0.72rem;
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid var(--border);
    color: var(--muted);
    background: rgba(255,255,255,0.03);
  }
  .rc-tag.parsed {
    border-color: rgba(200,245,66,0.3);
    color: var(--accent);
    background: rgba(200,245,66,0.06);
  }

  .rc-bars { display: flex; flex-direction: column; gap: 10px; }
  .rc-bar-row { display: flex; align-items: center; gap: 12px; }
  .rc-bar-label { font-size: 0.72rem; color: var(--muted); width: 90px; flex-shrink: 0; }
  .rc-bar-track {
    flex: 1;
    height: 5px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    overflow: hidden;
  }
  .rc-bar-fill {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    width: 0%;
    transition: width 1.4s cubic-bezier(0.4,0,0.2,1);
  }
  .rc-badge {
    position: absolute;
    top: 18px; right: 18px;
    font-size: 0.65rem;
    font-weight: 600;
    background: rgba(200,245,66,0.12);
    color: var(--accent);
    border: 1px solid rgba(200,245,66,0.25);
    padding: 4px 10px;
    border-radius: 20px;
    display: flex; align-items: center; gap: 5px;
  }
  .pulse {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 1.5s ease infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  /* ── SECTION ── */
  section {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 80px 24px;
  }

  .section-label {
    font-size: 0.7rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: 500;
    margin-bottom: 14px;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: 16px;
  }
  .section-sub {
    color: var(--muted);
    font-size: 1rem;
    font-weight: 300;
    max-width: 480px;
    line-height: 1.7;
    margin-bottom: 52px;
  }

  /* ── FEATURES GRID ── */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .feature-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    position: relative;
    overflow: hidden;
  }
  .feature-card:hover {
    border-color: rgba(200,245,66,0.2);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .feature-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    background: radial-gradient(circle at 60% 0%, rgba(200,245,66,0.04), transparent 70%);
    pointer-events: none;
  }

  .feature-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    background: rgba(200,245,66,0.08);
    border: 1px solid rgba(200,245,66,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    margin-bottom: 18px;
  }
  .feature-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 8px;
  }
  .feature-desc {
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.7;
    font-weight: 300;
  }

  /* ── HOW IT WORKS ── */
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0;
    position: relative;
  }
  .steps::before {
    content: '';
    position: absolute;
    top: 22px; left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), var(--border), transparent);
  }
  .step {
    text-align: center;
    padding: 0 20px;
    position: relative;
  }
  .step-num {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 0.9rem;
    color: var(--accent);
    margin: 0 auto 18px;
    position: relative;
    z-index: 1;
  }
  .step-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 8px;
  }
  .step-desc {
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.7;
  }

  /* ── CTA BANNER ── */
  .cta-banner {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 60px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-banner::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent);
  }
  .cta-banner h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 12px;
  }
  .cta-banner p {
    color: var(--muted);
    font-size: 0.95rem;
    font-weight: 300;
    margin-bottom: 32px;
  }
  .cta-buttons { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  /* ── FOOTER ── */
  footer {
    position: relative;
    z-index: 1;
    border-top: 1px solid var(--border);
    padding: 28px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  footer p { font-size: 0.8rem; color: var(--muted); }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    nav { padding: 16px 20px; }
    .hero-cta { flex-direction: column; align-items: center; }
    footer { flex-direction: column; text-align: center; }
    .steps::before { display: none; }
    .cta-banner { padding: 40px 24px; }
  }
`;

const features = [
  {
    icon: "⚡",
    title: "Instant Parsing",
    desc: "Upload your resume and get structured data in seconds — no waiting, no delays.",
  },
  {
    icon: "🧠",
    title: "AI-Powered Extraction",
    desc: "Intelligently extracts skills, experience, education, and contact information.",
  },
  {
    icon: "📄",
    title: "Multi-format Support",
    desc: "Works seamlessly with PDF, DOCX, and TXT resume formats.",
  },
  {
    icon: "🎯",
    title: "ATS Compatibility Score",
    desc: "Know how well your resume performs against Applicant Tracking Systems.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your data never leaves our secure servers. Full control, always.",
  },
  {
    icon: "📊",
    title: "Detailed Analytics",
    desc: "Get actionable insights and skill gap analysis to improve your resume.",
  },
];

const steps = [
  { num: "01", title: "Upload Resume", desc: "Drag & drop or browse your PDF/DOCX file." },
  { num: "02", title: "AI Parses It", desc: "Our engine extracts all key information." },
  { num: "03", title: "Review Results", desc: "See structured data and scores instantly." },
  { num: "04", title: "Export & Apply", desc: "Download structured data or push to your ATS." },
];

const barData = [
  { label: "Skills Match", width: "88%" },
  { label: "Experience", width: "72%" },
  { label: "ATS Score", width: "94%" },
];

export default function HomePage({ onNavigate }) {
  const barsRef = useRef(null);
  const barsAnimated = useRef(false);

  // Animate bars on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !barsAnimated.current) {
            barsAnimated.current = true;
            const fills = entry.target.querySelectorAll(".rc-bar-fill");
            fills.forEach((fill) => {
              fill.style.width = fill.dataset.width;
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    if (barsRef.current) observer.observe(barsRef.current);
    return () => observer.disconnect();
  }, []);

  // Fade-in on scroll
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 80);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

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
          <button className="btn btn-ghost" onClick={() => onNavigate('/login')}>
            Log in
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('/admin/login')}>
            Admin
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('/register')}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-tag">✦ AI Resume Intelligence</div>
        <h1>
          Parse Resumes with <em>Precision</em> at Scale
        </h1>
        <p className="hero-sub">
          Upload any resume and instantly extract structured data — skills, experience,
          education, and ATS scores — powered by advanced AI.
        </p>
        <div className="hero-cta">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('/register')}
          >
            Start for Free →
          </button>
          <button
            className="btn btn-ghost btn-lg"
            onClick={() => onNavigate('/login')}
          >
            Sign In
          </button>
        </div>

        {/* DEMO CARD */}
        <div className="hero-visual" ref={barsRef}>
          <div className="resume-card">
            <div className="rc-badge">
              <div className="pulse" />
              Live Preview
            </div>
            <div className="rc-header">
              <div className="rc-avatar">A</div>
              <div>
                <div className="rc-name">Arjun Sharma</div>
                <div className="rc-role">Full-Stack Developer · Mumbai</div>
              </div>
            </div>
            <div className="rc-tags">
              {["React", "Node.js", "Python", "AWS", "TypeScript"].map((t) => (
                <span key={t} className="rc-tag parsed">
                  {t}
                </span>
              ))}
              {["5 yrs exp", "B.Tech CS"].map((t) => (
                <span key={t} className="rc-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="rc-bars">
              {barData.map((b) => (
                <div className="rc-bar-row" key={b.label}>
                  <span className="rc-bar-label">{b.label}</span>
                  <div className="rc-bar-track">
                    <div
                      className="rc-bar-fill"
                      data-width={b.width}
                      style={{ width: "0%" }}
                    />
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--accent)", minWidth: 32 }}>
                    {b.width}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section>
        <div className="section-label fade-in">Features</div>
        <div className="section-title fade-in">
          Everything you need to<br />understand any resume
        </div>
        <p className="section-sub fade-in">
          From raw document to actionable insights — Parse.AI handles every step
          so you can focus on finding the right talent.
        </p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card fade-in" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section>
        <div className="section-label fade-in">How It Works</div>
        <div className="section-title fade-in">Four steps to clarity</div>
        <p className="section-sub fade-in">
          Simple, fast, and accurate — from upload to insight in under 10 seconds.
        </p>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step fade-in" key={i}>
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section>
        <div className="cta-banner fade-in">
          <h2>Ready to parse smarter?</h2>
          <p>Join thousands of recruiters and job-seekers already using Parse.AI.</p>
          <div className="cta-buttons">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('/register')}
            >
              Create Free Account
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() => onNavigate('/login')}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="logo">
          Parse<span className="logo-dot">.</span>AI
        </div>
        <p>© {new Date().getFullYear()} Parse.AI · Built with ♥ for recruiters</p>
        <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Privacy · Terms</p>
      </footer>
    </>
  );
}
