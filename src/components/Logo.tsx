type MarkProps = { size?: number; mark?: string; cutout?: string };
type LogoProps = MarkProps & { text?: string; className?: string };

export function WhistleMark({
  size = 40,
  mark = '#FFB224',
  cutout = '#15110E',
}: MarkProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
    >
      <rect x="6" y="24" width="28" height="14" rx="3" fill={mark} />
      <circle cx="40" cy="40" r="17" fill={mark} />
      <circle cx="40" cy="40" r="5" fill={cutout} />
      <rect x="15" y="24" width="9" height="4" fill={cutout} />
      <circle cx="46" cy="16" r="5" stroke={mark} strokeWidth="3" />
    </svg>
  );
}

export function Logo({
  size = 40,
  mark = '#FFB224',
  cutout = '#15110E',
  text = '#F4EDE3',
  className = '',
}: LogoProps) {
  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: size * 0.2 }}
    >
      <WhistleMark size={size} mark={mark} cutout={cutout} />
      <span
        className="font-[family-name:var(--font-cond)] font-extrabold italic leading-none tracking-[-0.01em]"
        style={{ fontSize: size, color: text }}
      >
        Courtside
      </span>
    </span>
  );
}
