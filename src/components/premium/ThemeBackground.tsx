import React from 'react';
import { motion } from 'framer-motion';

interface ThemeBackgroundProps {
  theme: 'light' | 'dark';
}

const TRANSITION_SLOW = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
  mass: 1.2,
};

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden select-none pointer-events-none">
      {/* 
        GPU CROSS-FADE OPTIMIZATION FOR BACKGROUND GRADIENTS:
        Instead of interpolating gradient color strings in JS (which triggers continuous layout repaints),
        we render two hardware-accelerated absolute layers and cross-fade their opacities using CSS.
      */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-amber-50/70 via-orange-100/50 to-amber-100/30 transition-opacity duration-1000 ease-in-out ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-zinc-950 via-slate-950 to-neutral-950 transition-opacity duration-1000 ease-in-out ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Subtle overlay noise texture to enrich the aesthetic */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay" />

      {/* Vector Illustration Container */}
      <div className="absolute right-0 top-0 w-full md:w-2/3 h-full max-h-[800px] opacity-75 dark:opacity-60 transition-opacity duration-1000">
        <svg
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover origin-right-top"
        >
          {/* Light Mode Clouds / Sun Elements */}
          <g className="transition-opacity duration-700" style={{ opacity: isDark ? 0 : 1 }}>
            {/* Soft Sun Ray Glows */}
            <motion.circle
              cx="550"
              cy="250"
              r="140"
              fill="url(#sunGlow)"
              animate={{
                scale: isDark ? 0.7 : [1, 1.05, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Sun Body */}
            <motion.circle
              cx="550"
              cy="250"
              r="60"
              fill="#fb923c" // Tailwind orange-400
              className="drop-shadow-[0_0_30px_rgba(251,146,60,0.4)]"
              animate={{
                y: isDark ? -100 : 0,
                scale: isDark ? 0.2 : 1,
              }}
              transition={TRANSITION_SLOW}
            />

            {/* Fluffy Floating Cloud 1 */}
            <motion.path
              d="M200 450c0-38.6 31.4-70 70-70h20c33 0 60 27 60 60v10h-150v-0z"
              fill="url(#cloudGrad1)"
              animate={{
                x: isDark ? -150 : [0, 20, -10, 0],
                y: isDark ? 50 : [0, -5, 5, 0],
              }}
              transition={{
                x: { duration: 15, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                default: TRANSITION_SLOW,
              }}
            />

            {/* Fluffy Floating Cloud 2 */}
            <motion.path
              d="M480 380c0-27.6 22.4-50 50-50h60c44.2 0 80 35.8 80 80v20H480v-50z"
              fill="url(#cloudGrad2)"
              animate={{
                x: isDark ? 200 : [0, -25, 15, 0],
                y: isDark ? -30 : [0, 8, -8, 0],
              }}
              transition={{
                x: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                default: TRANSITION_SLOW,
              }}
            />
          </g>

          {/* Dark Mode Moon / Stars Elements */}
          <g className="transition-opacity duration-700" style={{ opacity: isDark ? 1 : 0 }}>
            {/* Star Sparkle Group */}
            {[
              { cx: 200, cy: 150, delay: 0, r: 2 },
              { cx: 350, cy: 100, delay: 0.5, r: 1.5 },
              { cx: 420, cy: 220, delay: 1.2, r: 2.5 },
              { cx: 280, cy: 280, delay: 0.8, r: 1.8 },
              { cx: 620, cy: 120, delay: 1.5, r: 2 },
              { cx: 150, cy: 300, delay: 0.3, r: 1.5 },
            ].map((star, idx) => (
              <motion.circle
                key={idx}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="#ffffff"
                animate={isDark ? {
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.2, 0.8],
                } : { opacity: 0 }}
                transition={{
                  duration: 2.5 + idx * 0.3,
                  repeat: Infinity,
                  delay: star.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* Moon Glow */}
            <motion.circle
              cx="550"
              cy="250"
              r="120"
              fill="url(#moonGlow)"
              animate={{
                scale: isDark ? [1, 1.04, 1] : 0.8,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Crescent Moon */}
            <motion.g
              animate={{
                y: isDark ? 0 : 150,
                rotate: isDark ? 0 : -25,
              }}
              transition={TRANSITION_SLOW}
            >
              {/* Main moon body */}
              <circle cx="550" cy="250" r="50" fill="#e2e8f0" />
              {/* Moon shadow cut-out to create crescent */}
              <circle cx="532" cy="235" r="50" fill="#09090b" className="transition-colors duration-1000" style={{ fill: isDark ? '#09090b' : '#fef3c7' }} />
            </motion.g>
          </g>

          {/* Definitions for Gradients */}
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffedd5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffedd5" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cloudGrad1" x1="270" y1="380" x2="270" y2="450" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="cloudGrad2" x1="560" y1="330" x2="560" y2="430" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
