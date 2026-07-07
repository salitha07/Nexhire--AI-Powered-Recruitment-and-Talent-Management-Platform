// src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing-container">
      <style>{`
        /* ===== RESET & BASE ===== */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .landing-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #1a1a2e;
          background: #ffffff;
          line-height: 1.6;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        /* ===== NAVBAR ===== */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: #1a3c5e;
          color: #ffffff;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(26, 60, 94, 0.15);
          padding: 0 24px;
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .navbar-brand svg {
          width: 32px;
          height: 32px;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-link {
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-primary-nav {
          background: #ffffff;
          color: #1a3c5e;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-primary-nav:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          background: #f0f4f8;
        }

        /* ===== HERO SECTION ===== */
        .hero {
          padding: 140px 24px 80px;
          background: linear-gradient(135deg, #1a3c5e 0%, #1e4d7a 50%, #2a5f8a 100%);
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: rgba(90, 138, 181, 0.1);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 6px 16px 6px 12px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .hero-badge svg {
          width: 16px;
          height: 16px;
          color: #fcd34d;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .hero-title span {
          color: #5a8ab5;
        }

        .hero-subtitle {
          font-size: 18px;
          color: #cbd5e1;
          margin-bottom: 32px;
          max-width: 480px;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .btn-hero-primary {
          background: #ffffff;
          color: #1a3c5e;
          padding: 14px 36px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          display: inline-block;
        }

        .btn-hero-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .btn-hero-secondary {
          background: transparent;
          color: #ffffff;
          padding: 14px 36px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.6);
        }

        .hero-stats {
          display: flex;
          gap: 32px;
          padding-top: 8px;
        }

        .hero-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #cbd5e1;
        }

        .hero-stat svg {
          width: 20px;
          height: 20px;
        }

        .hero-stat .stat-highlight {
          color: #fcd34d;
        }

        /* Hero Right Panel */
        .hero-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px;
          position: relative;
        }

        .hero-panel-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hero-panel-item:last-child {
          border-bottom: none;
        }

        .hero-panel-icon {
          background: #2a5f8a;
          padding: 12px;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .hero-panel-icon svg {
          width: 24px;
          height: 24px;
          color: #ffffff;
        }

        .hero-panel-text h4 {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 16px;
        }

        .hero-panel-text p {
          font-size: 14px;
          color: #94a3b8;
        }

        .hero-glow {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 120px;
          height: 120px;
          background: rgba(42, 95, 138, 0.3);
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        /* ===== FEATURES SECTION ===== */
        .features {
          padding: 80px 24px;
          background: #ffffff;
        }

        .features-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: #1a3c5e;
          margin-bottom: 12px;
        }

        .section-header p {
          font-size: 18px;
          color: #64748b;
          max-width: 560px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          background: #ffffff;
          border: 1px solid #e8edf2;
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(26, 60, 94, 0.08);
        }

        .feature-icon {
          background: #f0f4f8;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          transition: transform 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }

        .feature-icon svg {
          width: 32px;
          height: 32px;
          color: #1a3c5e;
        }

        .feature-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1a3c5e;
          margin-bottom: 8px;
        }

        .feature-card p {
          color: #64748b;
          font-size: 15px;
          line-height: 1.7;
        }

        /* ===== HOW IT WORKS ===== */
        .how-it-works {
          padding: 80px 24px;
          background: #f8fafc;
        }

        .how-it-works-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        .step-card {
          text-align: center;
        }

        .step-number {
          width: 64px;
          height: 64px;
          background: #1a3c5e;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 700;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(26, 60, 94, 0.15);
        }

        .step-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1a3c5e;
          margin-bottom: 6px;
        }

        .step-card p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        /* ===== STATS SECTION ===== */
        .stats {
          padding: 64px 24px;
          background: #1a3c5e;
          color: #ffffff;
        }

        .stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          text-align: center;
        }

        .stat-item h3 {
          font-size: 40px;
          font-weight: 800;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .stat-item p {
          color: #94a3b8;
          font-size: 15px;
        }

        /* ===== CTA SECTION ===== */
        .cta {
          padding: 80px 24px;
          background: #ffffff;
        }

        .cta-inner {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .cta h2 {
          font-size: 36px;
          font-weight: 700;
          color: #1a3c5e;
          margin-bottom: 12px;
        }

        .cta p {
          font-size: 18px;
          color: #64748b;
          margin-bottom: 32px;
        }

        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #1a3c5e;
          color: #ffffff;
          padding: 16px 40px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(26, 60, 94, 0.2);
        }

        .btn-cta:hover {
          transform: translateY(-3px) scale(1.02);
          background: #2a5f8a;
          box-shadow: 0 12px 40px rgba(26, 60, 94, 0.3);
        }

        .btn-cta svg {
          width: 20px;
          height: 20px;
        }

        /* ===== FOOTER ===== */
        .footer {
          background: #0f2940;
          color: #ffffff;
          padding: 64px 24px 32px;
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .footer-brand p {
          color: #94a3b8;
          font-size: 14px;
          margin: 12px 0 20px;
          max-width: 280px;
          line-height: 1.7;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .footer-social a {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .footer-social a:hover {
          background: #2a5f8a;
          transform: translateY(-2px);
        }

        .footer-social svg {
          width: 18px;
          height: 18px;
          color: #94a3b8;
        }

        .footer-social a:hover svg {
          color: #ffffff;
        }

        .footer-column h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .footer-column ul {
          list-style: none;
        }

        .footer-column ul li {
          margin-bottom: 10px;
        }

        .footer-column ul li a {
          color: #94a3b8;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-column ul li a:hover {
          color: #ffffff;
        }

        .footer-contact li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #94a3b8;
          font-size: 14px;
        }

        .footer-contact svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-bottom p {
          color: #64748b;
          font-size: 13px;
        }

        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }

        .footer-bottom-links a {
          color: #64748b;
          font-size: 13px;
          transition: color 0.3s ease;
        }

        .footer-bottom-links a:hover {
          color: #ffffff;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .footer-inner {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-title {
            font-size: 32px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .steps-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stats-inner {
            grid-template-columns: 1fr 1fr;
          }

          .footer-inner {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .navbar-actions .nav-link {
            display: none;
          }

          .hero-actions {
            flex-direction: column;
          }

          .hero-actions a {
            text-align: center;
          }

          .hero-stats {
            flex-wrap: wrap;
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }

          .stats-inner {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .stat-item h3 {
            font-size: 28px;
          }

          .hero-title {
            font-size: 28px;
          }

          .hero-panel {
            padding: 20px;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-bottom-links {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Nexhire
          </div>
          <div className="navbar-actions">
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="btn-primary-nav">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              AI-Powered Recruitment
            </div>
            <h1 className="hero-title">
              Find the Perfect Talent, <br /><span>Faster & Smarter</span>
            </h1>
            <p className="hero-subtitle">
              Nexhire uses AI to match the right candidates with the right opportunities. 
              Streamline your hiring process and build your dream team.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-hero-primary">Start Hiring Free</Link>
              <Link to="/about" className="btn-hero-secondary">Learn More</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <svg viewBox="0 0 24 24" fill="currentColor" className="stat-highlight">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span><span className="stat-highlight">4.9/5</span> Rating</span>
              </div>
              <div className="hero-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>10K+ Users</span>
              </div>
              <div className="hero-stat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>98% Success Rate</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-item">
              <div className="hero-panel-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="hero-panel-text">
                <h4>10,000+ Active Jobs</h4>
                <p>Updated daily from top companies</p>
              </div>
            </div>
            <div className="hero-panel-item">
              <div className="hero-panel-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="hero-panel-text">
                <h4>AI-Powered Matching</h4>
                <p>95% accuracy in candidate matching</p>
              </div>
            </div>
            <div className="hero-panel-item">
              <div className="hero-panel-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="hero-panel-text">
                <h4>2x Faster Hiring</h4>
                <p>Reduce time-to-hire by 50%</p>
              </div>
            </div>
            <div className="hero-glow"></div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features">
        <div className="features-inner">
          <div className="section-header">
            <h2>Why Choose Nexhire?</h2>
            <p>Built for modern recruitment, powered by AI, trusted by thousands</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3>Lightning Fast</h3>
              <p>AI-powered candidate matching that reduces hiring time by 50%</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="21" y1="3" x2="15" y2="9" />
                  <line x1="3" y1="21" x2="9" y2="15" />
                </svg>
              </div>
              <h3>Precision Matching</h3>
              <p>98% accuracy in matching candidates to job requirements</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Secure & Compliant</h3>
              <p>Enterprise-grade security with GDPR and CCPA compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-it-works">
        <div className="how-it-works-inner">
          <div className="section-header">
            <h2>How Nexhire Works</h2>
            <p>Four simple steps to transform your hiring process</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Create Account</h3>
              <p>Sign up as a candidate or recruiter in minutes</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Build Profile</h3>
              <p>Add your skills, experience, and preferences</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Get Matched</h3>
              <p>Our AI finds the perfect matches for you</p>
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Start Hiring</h3>
              <p>Connect, interview, and hire the best talent</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats">
        <div className="stats-inner">
          <div className="stat-item">
            <h3>10K+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-item">
            <h3>50K+</h3>
            <p>Jobs Posted</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Match Accuracy</p>
          </div>
          <div className="stat-item">
            <h3>4.9</h3>
            <p>User Rating</p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta">
        <div className="cta-inner">
          <h2>Ready to Transform Your Hiring?</h2>
          <p>Join thousands of companies and candidates already using Nexhire</p>
          <Link to="/register" className="btn-cta">
            Get Started Free
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 700 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px' }}>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Nexhire
            </div>
            <p>AI-powered recruitment platform helping companies find the best talent.</p>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>For Recruiters</h4>
            <ul>
              <li><a href="#">Post Jobs</a></li>
              <li><a href="#">Search Candidates</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Success Stories</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>For Candidates</h4>
            <ul>
              <li><a href="#">Find Jobs</a></li>
              <li><a href="#">Career Advice</a></li>
              <li><a href="#">Resume Builder</a></li>
              <li><a href="#">Job Alerts</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                support@nexhire.com
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +1 (555) 123-4567
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Nexhire. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;