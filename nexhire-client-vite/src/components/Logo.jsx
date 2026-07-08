function Logo({ size = 'md' }) {
  const dim = size === 'sm' ? 28 : size === 'lg' ? 48 : 36;
  const font = size === 'sm' ? 18 : size === 'lg' ? 28 : 22;
  const gap = size === 'sm' ? 8 : 10;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${gap}px` }}>
      <svg width={dim} height={dim} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#logoGrad)" />
        <circle cx="50" cy="38" r="16" fill="white" opacity="0.95" />
        <path d="M22 88 Q22 62 50 62 Q78 62 78 88" fill="white" opacity="0.95" />
        <polygon
          points="72,8 78,20 84,14 75,28 69,16 63,22"
          fill="white"
          opacity="0.85"
        />
      </svg>
      <span style={{
        fontSize: font,
        fontWeight: 700,
        color: '#1e3a5f',
        letterSpacing: '-0.5px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}>
        nex<span style={{ color: '#3b82f6' }}>hire</span>
      </span>
    </div>
  );
}

export default Logo;
