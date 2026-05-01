// src/components/brand/Wordmark.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Civic brand wordmark + framed-mark (v3.8.0).
//
// Three lockups:
//   <Wordmark />           — full horizontal: framed mark + "Veri.ai" wordmark
//   <Wordmark variant="text" />   — wordmark only, no mark (compact spaces)
//   <MarkOnly />           — square framed check (favicon / app icon)
//
// Per ARCH_BRAND_CIVIC_v3.8.md:
//   - Mark is a navy-filled square with white check inside, square corners 2px
//   - Wordmark is "Veri" in deep ink (#001734) + ".ai" in heritage navy (#002B5C)
//   - All weights normalized: text 500 for "Veri", 400 for ".ai"
//   - Letter-spacing: -0.02em
//
// Why a component (not inline JSX everywhere):
//   - Single source of truth — change once, update everywhere
//   - Preserves accessible aria-label automatically
//   - Variant prop lets headers / footers / favicons share the same logic
//   - Future: localized wordmark for BM/中文 surfaces (currently English only)
// ─────────────────────────────────────────────────────────────────────────────

export function Wordmark({
  variant = 'full',     // 'full' | 'text' | 'stacked'
  size = 'md',          // 'sm' | 'md' | 'lg' | 'xl'
  inverse = false,      // true → render light-on-dark (footer / dark backgrounds)
  className,
  style: styleOverride,
}) {
  const px = sizeMap[size] || sizeMap.md;

  // Color tokens
  const inkPrimary = inverse ? '#FFFFFF' : '#001734';
  const inkAccent = inverse ? '#FFFFFF' : '#002B5C';
  const markFill = inverse ? '#FFFFFF' : '#002B5C';
  const markCheck = inverse ? '#002B5C' : '#FFFFFF';

  const wrapperStyle = {
    display: 'inline-flex',
    alignItems: variant === 'stacked' ? 'center' : 'baseline',
    flexDirection: variant === 'stacked' ? 'column' : 'row',
    gap: variant === 'stacked' ? '6px' : `${px.gap}px`,
    textDecoration: 'none',
    ...styleOverride,
  };

  return (
    <span className={className} style={wrapperStyle} aria-label="Veri.ai">
      {variant !== 'text' && (
        <FramedMark size={px.markSize} fill={markFill} check={markCheck} />
      )}
      <span
        style={{
          fontSize: px.fontSize,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: inkPrimary,
          fontFamily: 'inherit',
          lineHeight: 1,
        }}
      >
        Veri
      </span>
      <span
        style={{
          fontSize: px.fontSize,
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: inkAccent,
          fontFamily: 'inherit',
          lineHeight: 1,
          marginLeft: variant === 'stacked' ? 0 : '0px',
        }}
      >
        .ai
      </span>
    </span>
  );
}

// Mark-only — for app icon / favicon / tight headers
export function MarkOnly({ size = 24, inverse = false, className, style: styleOverride }) {
  const fill = inverse ? '#FFFFFF' : '#002B5C';
  const check = inverse ? '#002B5C' : '#FFFFFF';
  return (
    <span className={className} style={styleOverride} aria-label="Veri.ai mark">
      <FramedMark size={size} fill={fill} check={check} />
    </span>
  );
}

// Internal — the actual SVG (square + check)
function FramedMark({ size = 24, fill = '#002B5C', check = '#FFFFFF' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" fill={fill} rx="2" ry="2" />
      <path
        d="M7 12 L 11 16 L 17 8"
        stroke={check}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Size scale — keeps wordmark + mark proportional across all surfaces
const sizeMap = {
  sm: { fontSize: 13, markSize: 14, gap: 5 },   // navbar mobile
  md: { fontSize: 17, markSize: 18, gap: 7 },   // navbar desktop, footer
  lg: { fontSize: 22, markSize: 24, gap: 8 },   // landing hero, login
  xl: { fontSize: 32, markSize: 36, gap: 11 },  // splash / large hero
};

// Default export = the Wordmark
export default Wordmark;
