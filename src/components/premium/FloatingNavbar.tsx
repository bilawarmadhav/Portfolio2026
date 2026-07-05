import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingNavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  videoActive: boolean;
  toggleVideo: () => void;
}

const SNAPPY_SPRING = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  theme,
  toggleTheme,
  videoActive,
  toggleVideo,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeHoverLink, setActiveHoverLink] = useState<string | null>(null);

  const navLinks = [
    { name: 'Skills.', href: '#skills' },
    { name: 'Work.', href: '#projects' },
    { name: 'LinkedIn.', href: 'https://linkedin.com', external: true },
    { name: 'Github.', href: 'https://github.com', external: true },
  ];

  return (
    <div 
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center w-full px-4"
      style={{ transform: 'translate3d(-50%, 0, 0)' }} // GPU Accelerated Centering
    >
      <motion.div
        layout
        transition={SNAPPY_SPRING}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setActiveHoverLink(null);
        }}
        className="
          flex items-center gap-4 py-2.5 px-4 rounded-full
          bg-white/10 dark:bg-black/20 
          backdrop-blur-xl border border-white/20 dark:border-white/10 
          shadow-[0_8px_32px_rgba(0,0,0,0.12)]
          will-change-transform transform-gpu select-none
        "
      >
        {/* Name / Logo - Always Visible */}
        <motion.div layout="position" className="flex items-center gap-2">
          <span className="font-semibold text-neutral-800 dark:text-white text-sm tracking-tight cursor-default">
            Avi Vashishta.
          </span>
        </motion.div>

        {/* Expandable Navigation Links */}
        <motion.div layout className="flex items-center gap-1">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, width: 0, scale: 0.9 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.9 }}
                transition={SNAPPY_SPRING}
                className="flex items-center gap-1 overflow-hidden"
              >
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    layout="position"
                    onMouseEnter={() => setActiveHoverLink(link.name)}
                    className="
                      relative px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 
                      hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors duration-200
                    "
                  >
                    <span className="relative z-10">{link.name}</span>
                    {/* Sliding Highlight Pill */}
                    {activeHoverLink === link.name && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        transition={SNAPPY_SPRING}
                        className="
                          absolute inset-0 bg-neutral-950/5 dark:bg-white/10 rounded-full z-0
                        "
                      />
                    )}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Toggles Container */}
        <motion.div layout="position" className="flex items-center gap-2 border-l border-neutral-300/30 dark:border-white/10 pl-2">
          {/* Virtual Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`
              relative p-2 rounded-full transition-all duration-300 outline-none
              ${videoActive 
                ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400' 
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10'
              }
            `}
            aria-label="Toggle Video Widget"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {videoActive && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            )}
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="
              p-2 rounded-full text-neutral-600 hover:bg-neutral-100 
              dark:text-neutral-300 dark:hover:bg-white/10 transition-colors duration-200 outline-none
            "
            aria-label="Toggle Theme"
          >
            <motion.div
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={SNAPPY_SPRING}
            >
              {theme === 'dark' ? (
                // Moon Icon
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                // Sun Icon
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </motion.div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
