import React from 'react';

/*
  Kinds:
    star, arrow, arrowCurve, spiral, scribble, sparkle, circle, bracket, lightning, heart
*/
export default function Doodle({ kind = 'star', size = 40, color, style = {}, className = '' }) {
  const s = size;
  const stroke = color || 'currentColor';
  const common = { width: s, height: s, viewBox: '0 0 40 40', fill: 'none', stroke, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

  const shapes = {
    star: (
      <svg {...common}>
        <path d="M20 5 L23 16 L34 16 L25 23 L28 34 L20 27 L12 34 L15 23 L6 16 L17 16 Z" />
      </svg>
    ),
    sparkle: (
      <svg {...common}>
        <path d="M20 4 L22 18 L36 20 L22 22 L20 36 L18 22 L4 20 L18 18 Z" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M6 20 L32 20" />
        <path d="M24 12 L34 20 L24 28" />
      </svg>
    ),
    arrowCurve: (
      <svg {...common}>
        <path d="M6 30 Q 20 5 32 20" />
        <path d="M26 12 L34 20 L24 24" />
      </svg>
    ),
    spiral: (
      <svg {...common}>
        <path d="M20 20 m-2 0 a 2 2 0 1 1 4 0 a 4 4 0 1 1 -8 0 a 6 6 0 1 1 12 0 a 8 8 0 1 1 -16 0" />
      </svg>
    ),
    scribble: (
      <svg {...common}>
        <path d="M4 20 Q 8 8 14 18 T 22 22 T 32 14 T 38 24" />
      </svg>
    ),
    circle: (
      <svg {...common}>
        <path d="M20 6 Q 34 8 34 20 Q 36 32 20 34 Q 4 34 6 20 Q 4 8 20 6 Z" />
      </svg>
    ),
    bracket: (
      <svg {...common}>
        <path d="M12 6 Q 4 20 12 34" />
        <path d="M28 6 Q 36 20 28 34" />
      </svg>
    ),
    lightning: (
      <svg {...common}>
        <path d="M22 4 L10 22 L18 22 L14 36 L28 16 L20 16 Z" />
      </svg>
    ),
    heart: (
      <svg {...common}>
        <path d="M20 34 C 4 22 6 8 14 8 C 18 8 20 12 20 12 C 20 12 22 8 26 8 C 34 8 36 22 20 34 Z" />
      </svg>
    ),
    plane: (
      <svg {...common} viewBox="0 0 60 60" width={size * 1.5} height={size * 1.5}>
        <path d="M6 30 L54 8 L42 52 L32 36 L6 30 Z" />
        <path d="M32 36 L42 52" />
        <path d="M6 30 L32 36" />
      </svg>
    ),
    trophy: (
      <svg {...common}>
        <path d="M12 8 H28 V18 Q28 26 20 26 Q12 26 12 18 Z" />
        <path d="M12 12 H6 Q6 20 12 20" />
        <path d="M28 12 H34 Q34 20 28 20" />
        <path d="M20 26 V32" />
        <path d="M14 34 H26" />
      </svg>
    ),
    flask: (
      <svg {...common}>
        <path d="M16 6 H24" />
        <path d="M17 6 V16 L8 32 Q8 36 12 36 H28 Q32 36 32 32 L23 16 V6" />
        <path d="M12 26 H28" />
      </svg>
    ),
    calc: (
      <svg {...common}>
        <rect x="8" y="6" width="24" height="28" rx="2" />
        <rect x="12" y="10" width="16" height="6" />
        <circle cx="14" cy="22" r="1" />
        <circle cx="20" cy="22" r="1" />
        <circle cx="26" cy="22" r="1" />
        <circle cx="14" cy="28" r="1" />
        <circle cx="20" cy="28" r="1" />
        <circle cx="26" cy="28" r="1" />
      </svg>
    ),
  };

  return (
    <span className={`doodle ${className}`} style={style} aria-hidden="true">
      {shapes[kind] || shapes.star}
    </span>
  );
}
