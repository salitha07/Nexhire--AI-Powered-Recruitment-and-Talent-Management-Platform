// src/pages/jobs/JobListings.jsx
// Public page — candidates browse and filter all active job postings
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllJobs } from '../../services/jobsApi';
import Navbar from '../../components/Navbar';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#1e293b',
  },

  // ─── PAGE HEADER ────────────────────────────────────
  pageHeader: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 60%, #3b82f6 100%)',
    padding: '56px 80px 48px',
    color: 'white',
  },
  headerBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '16px',
    color: '#bfdbfe',
  },
  headerTitle: {
    fontSize: '38px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '12px',
    letterSpacing: '-0.5px',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#bfdbfe',
    marginBottom: '32px',
    maxWidth: '500px',
  },

  // ─── SEARCH & FILTERS ───────────────────────────────
  filterBar: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '10px',
    padding: '0 16px',
    flex: '1',
    minWidth: '220px',
    maxWidth: '380px',
    gap: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  searchIcon: {
    color: '#94a3b8',
    flexShrink: 0,
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#1e293b',
    background: 'transparent',
    padding: '12px 0',
    width: '100%',
  },
  filterSelect: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1e293b',
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    minWidth: '160px',
  },
  clearBtn: {
    padding: '12px 20px',
    border: '1.5px solid rgba(255,255,255,0.4)',
    borderRadius: '10px',
    background: 'transparent',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // ─── CONTENT AREA ───────────────────────────────────
  content: {
    padding: '40px 80px',
    maxWidth: '1280px',
    margin: '0 auto',
  },
  resultsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  resultsCount: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  sortSelect: {
    padding: '8px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#1e293b',
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
  },

  // ─── JOB CARDS GRID ─────────────────────────────────
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '4px',
  },
  cardHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.3',
  },
  cardCompany: {
    fontSize: '14px',
    color: '#3b82f6',
    fontWeight: '600',
  },
  typeBadge: {
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  cardMeta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '12px',
    marginBottom: '16px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#475569',
    fontWeight: '500',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
    flex: '1',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  cardDate: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  viewBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },

  // ─── STATES ─────────────────────────────────────────
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },
  skeletonCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  skeletonLine: (w, h = '14px') => ({
    background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '6px',
    height: h,
    width: w,
  }),
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  emptyDesc: {
    fontSize: '14px',
    color: '#64748b',
  },
};

const typeBadgeColors = {
  'full-time': { background: '#dbeafe', color: '#1e40af' },
  'part-time': { background: '#fef3c7', color: '#92400e' },
  'remote':    { background: '#dcfce7', color: '#166534' },
  'hybrid':    { background: '#ede9fe', color: '#5b21b6' },
};

function getTypeBadgeStyle(type) {
  const key = type?.toLowerCase();
  return typeBadgeColors[key] || { background: '#f1f5f9', color: '#475569' };
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  if (diff < 30) return `${diff} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SkeletonCard() {
  return (
    <div style={styles.skeletonCard}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ ...styles.skeletonLine('48px', '48px'), borderRadius: '10px', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={styles.skeletonLine('70%')} />
          <div style={styles.skeletonLine('45%', '12px')} />
        </div>
      </div>
      <div style={styles.skeletonLine('85%', '16px')} />
      <div style={styles.skeletonLine('60%', '12px')} />
      <div style={styles.skeletonLine('40%', '12px')} />
    </div>
  );
}

function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div 
      style={{ position: 'relative', minWidth: '180px', outline: 'none' }}
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 16px',
          background: 'white',
          borderRadius: '10px',
          fontSize: '14px',
          color: value ? '#1e293b' : '#64748b',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          border: isOpen ? '1.5px solid #3b82f6' : '1.5px solid transparent',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ fontWeight: value ? '600' : '500' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 100,
          overflow: 'hidden',
          padding: '6px',
          border: '1px solid #e2e8f0',
          animation: 'fadeIn 0.15s ease-out'
        }}>
          {options.map(opt => (
            <div 
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="custom-select-option"
              style={{
                padding: '10px 14px',
                fontSize: '14px',
                cursor: 'pointer',
                color: opt.value === value ? '#1e40af' : '#1e293b',
                background: opt.value === value ? '#eff6ff' : 'transparent',
                fontWeight: opt.value === value ? '600' : '500',
                borderRadius: '6px',
                marginBottom: '2px',
                transition: 'background 0.15s, color 0.15s'
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllJobs(search, typeFilter, locationFilter);
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, locationFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setLocationFilter('');
  };

  const hasFilters = search || typeFilter || locationFilter;

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .job-card:hover {
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.12) !important;
          transform: translateY(-2px) !important;
          border-color: #bfdbfe !important;
        }
        .view-btn:hover { opacity: 0.85 !important; }
        .nav-link:hover { color: #1e40af !important; }
        .custom-select-option:hover { background: #f8fafc !important; }
      `}</style>

      <Navbar />

      {/* Page Header with Search */}
      <div style={styles.pageHeader}>
        <div style={styles.headerBadge}>💼 JOB BOARD</div>
        <h1 style={styles.headerTitle}>
          Find Your Next<br />Opportunity
        </h1>
        <p style={styles.headerSubtitle}>
          Browse through hundreds of curated job postings matched to your skills.
        </p>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          {/* Search */}
          <div style={styles.searchWrapper}>
            <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search job title or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Job Type Filter */}
          <CustomSelect
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="All Job Types"
            options={[
              { value: '', label: 'All Job Types' },
              { value: 'full-time', label: 'Full-time' },
              { value: 'part-time', label: 'Part-time' },
              { value: 'remote', label: 'Remote' },
              { value: 'hybrid', label: 'Hybrid' },
            ]}
          />

          {/* Location Filter */}
          <input
            type="text"
            placeholder="📍 Filter by location…"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            style={{ ...styles.filterSelect, minWidth: '200px', cursor: 'text' }}
          />

          {/* Clear */}
          {hasFilters && (
            <button onClick={handleClearFilters} style={styles.clearBtn}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Results Row */}
        {!loading && !error && (
          <div style={styles.resultsRow}>
            <span style={styles.resultsCount}>
              {jobs.length === 0
                ? 'No jobs found'
                : `${jobs.length} job${jobs.length === 1 ? '' : 's'} found`}
              {hasFilters && ' (filtered)'}
            </span>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div style={styles.loadingGrid}>
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={styles.emptyState}>
            <div style={{ ...styles.emptyIcon, background: '#fee2e2' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div style={styles.emptyTitle}>{error}</div>
            <button
              onClick={fetchJobs}
              style={{ ...styles.viewBtn, marginTop: '16px', border: 'none' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div style={styles.emptyTitle}>No jobs found</div>
            <div style={styles.emptyDesc}>
              Try adjusting your search or filters to find more results.
            </div>
            {hasFilters && (
              <button onClick={handleClearFilters}
                style={{ ...styles.viewBtn, marginTop: '16px', border: 'none' }}>
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div style={styles.grid}>
            {jobs.map(job => (
              <div
                key={job.id}
                className="job-card"
                style={styles.card}
              >
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div style={styles.cardHeaderLeft}>
                    <div style={styles.cardTitle}>{job.title}</div>
                    <div style={styles.cardCompany}>
                      {job.postedByFullName || job.postedByEmail}
                    </div>
                  </div>
                  <span style={{ ...styles.typeBadge, ...getTypeBadgeStyle(job.type) }}>
                    {job.type}
                  </span>
                </div>

                {/* Meta Info (Location & Salary) */}
                <div style={styles.cardMeta}>
                  <span style={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {job.location}
                  </span>
                  
                  {job.salaryRange && (
                    <span style={styles.metaItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      {job.salaryRange}
                    </span>
                  )}
                </div>

                {/* Description preview */}
                <p style={styles.cardDesc}>
                  {job.description?.length > 130
                    ? job.description.substring(0, 130) + '...'
                    : job.description}
                </p>

                {/* Card Footer */}
                <div style={styles.cardFooter}>
                  <span style={styles.cardDate}>
                    Posted {formatDate(job.createdAt)}
                  </span>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="view-btn"
                    style={styles.viewBtn}
                  >
                    View Details 
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobListings;
