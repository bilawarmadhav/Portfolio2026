import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingNavbar } from './FloatingNavbar';
import { TextScrambleHero } from './TextScrambleHero';
import { DragCanvasWidgets } from './DragCanvasWidgets';
import { ThemeBackground } from './ThemeBackground';

export const PremiumShowcase: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [videoActive, setVideoActive] = useState<boolean>(false);

  // Sync Tailwind class name on theme change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleVideo = () => {
    setVideoActive((prev) => !prev);
  };

  // Heavy inertia config for floating video widget
  const snappySpring = {
    type: 'spring',
    stiffness: 300,
    damping: 25,
    mass: 0.5,
  };

  return (
    <div className="relative min-h-screen text-neutral-800 dark:text-neutral-100 transition-colors duration-500 overflow-x-hidden font-sans">
      {/* 1. Theme Vector & Gradient Background */}
      <ThemeBackground theme={theme} />

      {/* 2. Collapsible Floating Navbar */}
      <FloatingNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        videoActive={videoActive}
        toggleVideo={toggleVideo}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-20">
        {/* Hero Headline Section */}
        <section className="min-h-[50vh] flex flex-col justify-center items-start gap-6 select-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappySpring, delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            <span className="text-xs font-semibold tracking-widest text-orange-500 dark:text-cyan-400 uppercase">
              Aesthetics & Physics
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
              Engineering <br />
              <span className="text-orange-500 dark:text-cyan-400 font-serif italic font-normal tracking-wide mr-4">
                Premium
              </span>
              {/* 3. Text Scrambler Headline */}
              <TextScrambleHero
                words={['Experiences.', 'Interfaces.', 'Interactions.', 'Fluidity.']}
                scrambleSpeed={0.6}
                holdTime={3000}
              />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappySpring, delay: 0.25 }}
            className="text-base md:text-lg max-w-xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium"
          >
            A modular playground demonstrating buttery-smooth 120Hz micro-interactions. Hover over the navbar, drag the tech stack pills below, or switch the theme to observe the physics interpolation.
          </motion.p>
        </section>

        {/* 4. Drag Physics Canvas */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...snappySpring, delay: 0.4 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Fluid Grid Physics
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Drag, throw, and watch elements interact. Rebounds are calculated on the fly.
            </p>
          </div>

          <DragCanvasWidgets />
        </motion.section>
      </main>

      {/* 5. Interactive Webcam Avatar Widget (Triggered by Navbar Cam Icon) */}
      <AnimatePresence>
        {videoActive && (
          <motion.div
            drag
            dragElastic={0.3}
            dragMomentum={true}
            initial={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={snappySpring}
            whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
            className="
              fixed bottom-8 right-8 z-40 w-44 h-44 rounded-2xl overflow-hidden cursor-grab
              bg-neutral-950 border-2 border-emerald-500 shadow-[0_12px_40px_rgba(16,185,129,0.3)]
              will-change-transform transform-gpu
            "
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-center p-4">
              {/* Virtual Video Feed - simulated for UI presentation */}
              <div className="flex flex-col items-center gap-1.5 text-emerald-400">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute top-3 right-3" />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-widest">LIVE CAMERA</span>
                <span className="text-[8px] text-neutral-400 font-mono">DRAG OR CLOSE ME</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PremiumShowcase;
