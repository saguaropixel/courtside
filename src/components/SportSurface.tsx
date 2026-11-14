import type { Sport } from '@/lib/cases';

export const themes: Record<
  Sport,
  {
    surface: string;
    ink: string;
    chipBg: string;
    chipFg: string | null;
    label: string;
  }
> = {
  baseball: {
    surface: '#335B2A',
    ink: '#F4F1E4',
    chipBg: '#15110E',
    chipFg: null,
    label: 'Baseball',
  },
  basketball: {
    surface: '#6F4627',
    ink: '#FFF3E0',
    chipBg: '#15110E',
    chipFg: null,
    label: 'Basketball',
  },
  football: {
    surface: '#1E5B47',
    ink: '#F1F7F3',
    chipBg: '#15110E',
    chipFg: null,
    label: 'Football',
  },
  hockey: {
    surface: '#D3E6F3',
    ink: '#0F2438',
    chipBg: '#0F2438',
    chipFg: '#D3E6F3',
    label: 'Hockey',
  },
  soccer: {
    surface: '#2E7A3F',
    ink: '#F5FAF2',
    chipBg: '#15110E',
    chipFg: null,
    label: 'Soccer',
  },
};

const common = {
  'aria-hidden': true,
  viewBox: '0 0 400 520',
  className: 'pointer-events-none absolute inset-0 h-full w-full',
  fill: 'none',
} as const;

export function SportSurface({ sport }: { sport: Sport }) {
  switch (sport) {
    case 'baseball':
      return (
        <svg
          {...common}
          preserveAspectRatio="xMidYMax slice"
          stroke="#F4F1E4"
          strokeWidth="3"
        >
          <path
            d="M200 500L335 365L200 230L65 365Z"
            fill="#8C5E3C"
            fillOpacity="0.55"
            stroke="none"
          />
          <circle
            cx="200"
            cy="365"
            r="16"
            fill="#8C5E3C"
            fillOpacity="0.8"
            stroke="none"
          />
          <g opacity="0.5">
            <path d="M200 500L-70 230M200 500L470 230" />
            <path d="M200 500L335 365L200 230L65 365Z" />
            <path d="M-20 170A260 260 0 0 1 420 170" />
          </g>
        </svg>
      );
    case 'basketball':
      return (
        <svg
          {...common}
          preserveAspectRatio="xMidYMax slice"
          stroke="#FFF3E0"
          strokeWidth="3"
          opacity="0.35"
        >
          <rect x="110" y="-10" width="180" height="250" />
          <path d="M110 240a90 90 0 0 0 180 0" />
          <path d="M110 240a90 90 0 0 1 180 0" strokeDasharray="10 10" />
          <path d="M-20 140h130M290 140h130" />
          <path d="M170 -10v30h60v-30" />
          <circle cx="200" cy="40" r="10" />
          <path d="M-10 430a210 210 0 0 1 420 0" />
        </svg>
      );
    case 'football':
      return (
        <svg
          {...common}
          preserveAspectRatio="xMidYMid slice"
          stroke="#F1F7F3"
          strokeWidth="3"
          opacity="0.4"
        >
          <path d="M-10 60H410M-10 130H410M-10 200H410M-10 270H410M-10 340H410M-10 410H410M-10 480H410" />
          <path d="M185 95h30M185 165h30M185 235h30M185 305h30M185 375h30M185 445h30" />
        </svg>
      );
    case 'hockey':
      return (
        <svg {...common} preserveAspectRatio="xMidYMid slice" opacity="0.9">
          <path d="M-10 160H410" stroke="#2F6FD0" strokeWidth="10" />
          <path d="M-10 360H410" stroke="#2F6FD0" strokeWidth="10" />
          <path
            d="M-10 260H410"
            stroke="#C8283C"
            strokeWidth="7"
            strokeDasharray="16 8"
          />
          <path
            d="M140 260a60 60 0 1 0 120 0a60 60 0 1 0 -120 0"
            stroke="#C8283C"
            strokeWidth="3"
          />
          <circle cx="200" cy="260" r="6" fill="#2F6FD0" />
          <path
            d="M150 -10V40a50 50 0 0 0 100 0V-10"
            stroke="#C8283C"
            strokeWidth="3"
          />
          <path
            d="M150 530V480a50 50 0 0 1 100 0V530"
            stroke="#C8283C"
            strokeWidth="3"
          />
        </svg>
      );
    case 'soccer':
      return (
        <svg
          {...common}
          preserveAspectRatio="xMidYMid slice"
          stroke="#F5FAF2"
          strokeWidth="3"
          opacity="0.45"
        >
          <path d="M-10 260H410" />
          <circle cx="200" cy="260" r="70" />
          <circle cx="200" cy="260" r="5" fill="#F5FAF2" />
          <path d="M105 -10V90H295V-10" />
          <path d="M105 530V430H295V530" />
          <path d="M160 -10V30H240V-10M160 530V490H240V530" />
        </svg>
      );
  }
}
