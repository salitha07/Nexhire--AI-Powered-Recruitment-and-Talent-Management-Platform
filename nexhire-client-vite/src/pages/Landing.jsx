import { Link } from 'react-router-dom';
import heroBg from "../assets/hero-bg.jpg";



const styles = {
  page: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#1e293b',
    background: '#ffffff',
  },

  // ─── NAVBAR ───────────────────────────────────────────────
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 80px',
    background: '#f4f5f8',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  navLogoIcon: {
    width: '34px',
    height: '34px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLogoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e3a5f',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    fontSize: '14px',
    color: '#64748b',
    textDecoration: 'none',
    fontWeight: '500',
  },
  navBtnOutline: {
    padding: '8px 20px',
    border: '1.5px solid #1e40af',
    borderRadius: '8px',
    background: 'white',
    color: '#1e40af',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  navBtnFill: {
    padding: '8px 20px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },

  // ─── HERO ─────────────────────────────────────────────────
  hero: {
  backgroundImage: `
    linear-gradient(
      rgba(13, 32, 56, 0.75),
      rgba(13, 32, 56, 0.75)
    ),
    url(${heroBg})
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",

  padding: "120px 80px",
  textAlign: "center",
  color: "white",
  minHeight: "80vh",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
},
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '20px',
    padding: '6px 16px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    marginBottom: '24px',
    color: '#bfdbfe',
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: '800',
    lineHeight: '1.15',
    marginBottom: '20px',
    letterSpacing: '-1px',
  },
  heroTitleAccent: {
    color: '#93c5fd',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#bfdbfe',
    maxWidth: '560px',
    margin: '0 auto 40px auto',
    lineHeight: '1.7',
  },
  heroBtns: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  heroBtnPrimary: {
    padding: '14px 32px',
    background: 'white',
    color: '#1e40af',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  heroBtnSecondary: {
    padding: '14px 32px',
    background: 'rgba(255,255,255,0.12)',
    color: 'white',
    border: '1.5px solid rgba(255,255,255,0.4)',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '60px',
    marginTop: '64px',
    flexWrap: 'wrap',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'white',
  },
  statLabel: {
    fontSize: '13px',
    color: '#bfdbfe',
    marginTop: '4px',
  },

  // ─── FEATURES ─────────────────────────────────────────────
  features: {
    padding: '80px 80px',
    background: '#f8fafc',
  },
  sectionLabel: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: '#3b82f6',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '34px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '12px',
    letterSpacing: '-0.5px',
  },
  sectionSubtitle: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#64748b',
    maxWidth: '500px',
    margin: '0 auto 56px auto',
    lineHeight: '1.7',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  featureCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px 28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  featureDesc: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.7',
  },

  // ─── HOW IT WORKS ──────────────────────────────────────────
  howItWorks: {
    padding: '80px 80px',
    background: '#ffffff',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
    position: 'relative',
  },
  stepCard: {
    textAlign: 'center',
    padding: '24px 16px',
  },
  stepNumber: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    fontSize: '20px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
  },
  stepTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  stepDesc: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.6',
  },

  // ─── ROLES ────────────────────────────────────────────────
  roles: {
    padding: '80px 80px',
    background: '#f8fafc',
  },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  roleCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  roleIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '6px',
  },
  roleDesc: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.6',
  },

  // ─── CTA ──────────────────────────────────────────────────
  cta: {
    padding: '80px',
    background: 'linear-gradient(135deg, #1e3a5f, #1e40af)',
    textAlign: 'center',
    color: 'white',
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '16px',
    letterSpacing: '-0.5px',
  },
  ctaSubtitle: {
    fontSize: '16px',
    color: '#bfdbfe',
    marginBottom: '36px',
    maxWidth: '480px',
    margin: '0 auto 36px auto',
    lineHeight: '1.7',
  },
  ctaBtns: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaBtnPrimary: {
    padding: '14px 36px',
    background: 'white',
    color: '#1e40af',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  ctaBtnSecondary: {
    padding: '14px 36px',
    background: 'transparent',
    color: 'white',
    border: '1.5px solid rgba(255,255,255,0.4)',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },

  // ─── FOOTER ───────────────────────────────────────────────
  footer: {
    background: '#0f172a',
    padding: '40px 80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerLogoIcon: {
    width: '28px',
    height: '28px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLogoText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
  },
  footerCopy: {
    fontSize: '13px',
    color: '#64748b',
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
  },
  footerLink: {
    fontSize: '13px',
    color: '#64748b',
    textDecoration: 'none',
  },
};

const features = [
  {
    title: 'AI-Powered Screening',
    desc: 'Automatically rank and screen candidates using advanced AI to find the best matches for your roles.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: 'Smart Job Matching',
    desc: 'Connect candidates with the right opportunities using intelligent skill-based matching algorithms.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Interview Scheduling',
    desc: 'Automate interview scheduling with calendar integration and instant notifications for all parties.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Resume Parsing',
    desc: 'Extract skills, experience, and qualifications from resumes automatically with AI-driven analysis.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Get deep insights into your recruitment pipeline with real-time analytics and performance metrics.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: 'Role-Based Access',
    desc: 'Separate portals for candidates, recruiters, hiring managers, and admins with tailored experiences.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

const steps = [
  { number: '1', title: 'Create Account', desc: 'Sign up as a candidate or recruiter in seconds.' },
  { number: '2', title: 'Build Profile', desc: 'Upload your resume and showcase your skills.' },
  { number: '3', title: 'Get Matched', desc: 'AI finds the best jobs or candidates for you.' },
  { number: '4', title: 'Get Hired', desc: 'Schedule interviews and land your dream role.' },
];

const roles = [
  {
    title: 'Job Seekers',
    desc: 'Create your profile, upload your CV, and let AI match you with the perfect opportunities.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: 'Recruiters',
    desc: 'Post jobs, search candidates, and use AI screening to find top talent faster than ever.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: 'Hiring Managers',
    desc: 'Review shortlisted candidates, provide feedback, and make confident hiring decisions.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'Administrators',
    desc: 'Manage users, monitor system health, and access powerful analytics across the platform.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

function Landing() {
  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>
          <div style={styles.navLogoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span style={styles.navLogoText}>Nexhire</span>
        </div>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#how-it-works" style={styles.navLink}>How it Works</a>
          <a href="#roles" style={styles.navLink}>For You</a>
          <Link to="/login" style={styles.navBtnOutline}>Sign In</Link>
          <Link to="/register" style={styles.navBtnFill}>Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>🤖 AI-POWERED RECRUITMENT</div>
        <h1 style={styles.heroTitle}>
          Hire Smarter.<br />
          <span style={styles.heroTitleAccent}>Find Better.</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Nexhire uses artificial intelligence to automate candidate screening,
          match talent to roles, and streamline your entire recruitment lifecycle.
        </p>
        <div style={styles.heroBtns}>
          <Link to="/register" style={styles.heroBtnPrimary}>
            Get Started Free
          </Link>
          <Link to="/login" style={styles.heroBtnSecondary}>
            Sign In →
          </Link>
        </div>
        <div style={styles.heroStats}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>10x</div>
            <div style={styles.statLabel}>Faster Screening</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>95%</div>
            <div style={styles.statLabel}>Match Accuracy</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>4</div>
            <div style={styles.statLabel}>User Roles</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>AI</div>
            <div style={styles.statLabel}>Powered Engine</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.features}>
        <div style={styles.sectionLabel}>FEATURES</div>
        <h2 style={styles.sectionTitle}>Everything You Need to Hire</h2>
        <p style={styles.sectionSubtitle}>
          A complete recruitment toolkit powered by AI — from posting jobs to making offers.
        </p>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <div style={styles.featureTitle}>{f.title}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={styles.howItWorks}>
        <div style={styles.sectionLabel}>HOW IT WORKS</div>
        <h2 style={styles.sectionTitle}>Simple. Fast. Intelligent.</h2>
        <p style={styles.sectionSubtitle}>
          Get started in minutes and let AI do the heavy lifting for you.
        </p>
        <div style={styles.stepsGrid}>
          {steps.map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNumber}>{s.number}</div>
              <div style={styles.stepTitle}>{s.title}</div>
              <div style={styles.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" style={styles.roles}>
        <div style={styles.sectionLabel}>FOR EVERYONE</div>
        <h2 style={styles.sectionTitle}>Built for Every Role</h2>
        <p style={styles.sectionSubtitle}>
          Tailored experiences for every person in the hiring process.
        </p>
        <div style={styles.rolesGrid}>
          {roles.map((r, i) => (
            <div key={i} style={styles.roleCard}>
              <div style={styles.roleIconBox}>{r.icon}</div>
              <div>
                <div style={styles.roleTitle}>{r.title}</div>
                <div style={styles.roleDesc}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Transform Your Hiring?</h2>
        <p style={styles.ctaSubtitle}>
          Join thousands of companies using Nexhire to find and hire top talent faster.
        </p>
        <div style={styles.ctaBtns}>
          <Link to="/register" style={styles.ctaBtnPrimary}>
            Create Free Account
          </Link>
          <Link to="/login" style={styles.ctaBtnSecondary}>
            Sign In
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo}>
          <div style={styles.footerLogoIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span style={styles.footerLogoText}>Nexhire</span>
        </div>
        <span style={styles.footerCopy}>
          © 2026 Nexhire. AI-Powered Recruitment Platform.
        </span>
        <div style={styles.footerLinks}>
          <a href="#features" style={styles.footerLink}>Features</a>
          <a href="#how-it-works" style={styles.footerLink}>How it Works</a>
          <Link to="/login" style={styles.footerLink}>Sign In</Link>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
