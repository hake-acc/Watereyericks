import React from 'react';

// position: 'tl' | 'tr' | 'bl' | 'br'
export default function Tape({ position = 'tl', color, style = {} }) {
  const bg = color ? { background: color } : {};
  return <span className={`tape tape--${position}`} style={{ ...bg, ...style }} />;
}
