import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface Widget {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string; // Tailwind glow color class
  borderColor: string;
  initialX: string;
  initialY: string;
  driftDuration: number;
}

export const DragCanvasWidgets: React.FC = () => {
  const constraintsRef = useRef<HTMLDivElement>(null);

  const widgets: Widget[] = [
    {
      id: 'react',
      name: 'React.js',
      color: 'shadow-cyan-500/20 hover:shadow-cyan-400/40 text-cyan-400',
      borderColor: 'border-cyan-500/20',
      initialX: '10%',
      initialY: '15%',
      driftDuration: 4.8,
      icon: (
        <svg viewBox="-10.5 -9.45 21 18.9" fill="currentColor" className="w-5 h-5">
          <circle cx="0" cy="0" r="2" />
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="10" ry="4.5" />
            <ellipse rx="10" ry="4.5" transform="rotate(60)" />
            <ellipse rx="10" ry="4.5" transform="rotate(120)" />
          </g>
        </svg>
      ),
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      color: 'shadow-neutral-500/20 hover:shadow-neutral-400/40 text-white dark:text-white text-neutral-800',
      borderColor: 'border-neutral-500/20',
      initialX: '45%',
      initialY: '8%',
      driftDuration: 5.6,
      icon: (
        <svg viewBox="0 0 180 180" fill="currentColor" className="w-5 h-5">
          <path d="M90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0ZM143.5 143.5L88.5 73.5H74.5V116.5H84.5V85.5L133.5 148.5C121 158 106.5 163.5 90 163.5C49.5 163.5 16.5 130.5 16.5 90C16.5 49.5 49.5 16.5 90 16.5C124 16.5 152.5 39.5 161.5 70.5L143.5 143.5ZM104.5 116.5V73.5H94.5V116.5H104.5Z" />
        </svg>
      ),
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      color: 'shadow-sky-500/20 hover:shadow-sky-400/40 text-sky-400',
      borderColor: 'border-sky-500/20',
      initialX: '75%',
      initialY: '20%',
      driftDuration: 4.2,
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      ),
    },
    {
      id: 'framer',
      name: 'Framer Motion',
      color: 'shadow-pink-500/20 hover:shadow-pink-400/40 text-pink-400',
      borderColor: 'border-pink-500/20',
      initialX: '15%',
      initialY: '60%',
      driftDuration: 5.2,
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M0 0h12v12H0V0zm12 12h12v12H12V12zM0 12h12v12H0V12z" />
        </svg>
      ),
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      color: 'shadow-blue-500/20 hover:shadow-blue-400/40 text-blue-400',
      borderColor: 'border-blue-500/20',
      initialX: '48%',
      initialY: '55%',
      driftDuration: 4.6,
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M22.372 18.256c-.349.529-.877.944-1.583 1.246-.707.301-1.587.452-2.639.452-1.282 0-2.316-.312-3.102-.936-.786-.624-1.202-1.516-1.248-2.678h2.905c.047.469.231.854.553 1.155.321.301.768.452 1.341.452.484 0 .864-.108 1.137-.323.274-.215.411-.5.411-.854 0-.313-.099-.567-.297-.763-.198-.196-.49-.371-.877-.525l-.936-.369c-1.391-.547-2.398-1.07-3.023-1.569s-.937-1.266-.937-2.302c0-1.125.438-2.02 1.313-2.684s2.055-.996 3.539-.996c1.171 0 2.146.25 2.923.75s1.285 1.217 1.523 2.148h-2.905c-.094-.383-.3-.7-.617-.951s-.73-.377-1.238-.377c-.453 0-.8.094-1.043.281s-.363.453-.363.797c0 .266.082.48.246.645s.449.324.855.48l1.014.398c1.391.531 2.395 1.055 3.012 1.57s.926 1.277.926 2.285c-.001 1.094-.438 1.984-1.313 2.672zm-12.017-9.527v2.742h3.398v2.648h-3.398v5.531H7.313V8.729h7.453v2.648h-4.411z" />
        </svg>
      ),
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      color: 'shadow-emerald-500/20 hover:shadow-emerald-400/40 text-emerald-400',
      borderColor: 'border-emerald-500/20',
      initialX: '78%',
      initialY: '65%',
      driftDuration: 5.4,
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12 2L4 6.63v9.27L12 22l8-4.73V7.27L12 2zm6 13.5l-6 3.55-6-3.55v-7.1l6-3.55 6 3.55v7.1z" />
        </svg>
      ),
    },
  ];

  // Snappy yet smooth inertia settings based on high-inertia requirements:
  // Stiffness: 150, Damping: 15
  const HEAVY_INERTIA_SPRING = {
    power: 0.35,            // Glide range multiplier
    timeConstant: 250,      // Exponential deceleration rate
    bounceStiffness: 150,   // Stiffness of canvas edge bounce
    bounceDamping: 15,      // Damping of canvas edge bounce
  };

  return (
    <div
      ref={constraintsRef}
      className="relative w-full h-[550px] overflow-hidden rounded-3xl bg-neutral-900/50 dark:bg-black/40 border border-neutral-200/20 dark:border-white/5 shadow-inner"
    >
      {/* Decorative Grid Lines to hint that it is a physical space */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" 
      />

      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-0">
        <div className="text-left">
          <h3 className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-widest">
            Interactive Canvas
          </h3>
          <p className="text-neutral-400 dark:text-neutral-500 text-[11px]">
            Drag & throw the badges to clean up or mess up the space.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 dark:text-neutral-600 font-mono">
            BOUNDED PHYSICS / GPU RUNNING
          </span>
        </div>
      </div>

      {widgets.map((widget) => (
        <motion.div
          key={widget.id}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.25}
          dragTransition={HEAVY_INERTIA_SPRING}
          whileDrag={{ 
            scale: 1.1, 
            zIndex: 10,
            cursor: 'grabbing' 
          }}
          initial={{ left: widget.initialX, top: widget.initialY }}
          className="absolute cursor-grab select-none will-change-transform transform-gpu"
          style={{ transform: 'translate3d(0, 0, 0)' }} // GPU Layer Hook
        >
          {/* Inner element handles organic drifting animation to separate concerns and prevent layout/drag stutter */}
          <motion.div
            animate={{
              y: [0, -8, 8, 0],
              x: [0, 5, -5, 0],
            }}
            transition={{
              duration: widget.driftDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`
              flex items-center gap-2.5 px-4 py-3 rounded-2xl
              bg-white/10 dark:bg-neutral-900/60 
              backdrop-blur-md border ${widget.borderColor}
              shadow-[0_4px_16px_rgba(0,0,0,0.06)] ${widget.color}
              transition-shadow duration-300
            `}
          >
            <div className="flex-shrink-0">{widget.icon}</div>
            <span className="text-xs font-semibold tracking-wide select-none pointer-events-none text-neutral-800 dark:text-neutral-200">
              {widget.name}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
