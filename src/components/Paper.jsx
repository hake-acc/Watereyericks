import React from 'react';
import { motion } from 'framer-motion';

export default function Paper({
  children,
  variant = '',
  torn = false,
  rotate = 0,
  className = '',
  style = {},
  ...rest
}) {
  const cls = [
    'paper',
    variant ? `paper--${variant}` : '',
    torn ? 'paper--torn' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={cls}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
