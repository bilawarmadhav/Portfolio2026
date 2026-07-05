import React, { useState, useEffect, useRef } from 'react';

interface TextScrambleHeroProps {
  words: string[];
  scrambleSpeed?: number; // Reveal speed factor
  holdTime?: number;      // Time to display the settled word (ms)
  characters?: string;    // Character set to scramble with
  className?: string;
}

export const TextScrambleHero: React.FC<TextScrambleHeroProps> = ({
  words,
  scrambleSpeed = 0.55, // How fast the letters resolve (higher = faster)
  holdTime = 2500,
  characters = 'X01&_★$▲◆▼█▓░░▒▲◇◆■□',
  className = '',
}) => {
  const [displayText, setDisplayText] = useState(words[0]);
  const [isScrambling, setIsScrambling] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  const animationFrameId = useRef<number | null>(null);
  const timeoutId = useRef<number | null>(null);
  
  // Track current word states in refs for the requestAnimationFrame loop to avoid closures
  const currentWordRef = useRef(words[0]);
  const targetWordRef = useRef(words[0]);
  const frameRef = useRef(0);

  // Find the longest word to size the spacer wrapper perfectly
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), '');

  useEffect(() => {
    const triggerScramble = (nextWord: string) => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      currentWordRef.current = targetWordRef.current;
      targetWordRef.current = nextWord;
      frameRef.current = 0;
      setIsScrambling(true);

      const tick = () => {
        const startText = currentWordRef.current;
        const targetText = targetWordRef.current;
        const maxLength = Math.max(startText.length, targetText.length);

        if (frameRef.current >= maxLength) {
          setDisplayText(targetText);
          setIsScrambling(false);
          
          // Schedule next word scramble
          timeoutId.current = window.setTimeout(() => {
            const nextIdx = (words.indexOf(targetText) + 1) % words.length;
            setWordIndex(nextIdx);
            triggerScramble(words[nextIdx]);
          }, holdTime);
          return;
        }

        let output = '';
        for (let i = 0; i < maxLength; i++) {
          if (i < frameRef.current) {
            // Letter is resolved to target
            output += targetText[i] || '';
          } else {
            // Scrambling character or empty space
            if (targetText[i] === ' ' && startText[i] === ' ') {
              output += ' ';
            } else {
              const charIndex = Math.floor(Math.random() * characters.length);
              output += characters[charIndex];
            }
          }
        }

        setDisplayText(output);
        frameRef.current += scrambleSpeed;
        animationFrameId.current = requestAnimationFrame(tick);
      };

      animationFrameId.current = requestAnimationFrame(tick);
    };

    // Initialize loop after initial hold
    timeoutId.current = window.setTimeout(() => {
      const nextIdx = (wordIndex + 1) % words.length;
      setWordIndex(nextIdx);
      triggerScramble(words[nextIdx]);
    }, holdTime);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [words, scrambleSpeed, holdTime, characters, wordIndex]);

  return (
    <div className={`relative inline-block select-none font-mono will-change-transform ${className}`}>
      {/* 
        PREVENTS LAYOUT SHIFTS:
        We render the longest word invisibly in normal layout flow.
        This reserves the exact maximum horizontal space required by the text loop,
        ensuring elements after this text do not shift dynamically as word lengths change.
      */}
      <span className="invisible pointer-events-none opacity-0 select-none whitespace-pre uppercase tracking-wider">
        {longestWord}
      </span>

      {/* 
        ACCELERATED GPU TEXT LAYER:
        Using translate3d and transform-gpu class forces text to be rendered
        on its own GPU compositor layer, optimizing frame rate at 120Hz.
      */}
      <span
        className={`absolute left-0 top-0 whitespace-pre uppercase tracking-wider transition-all duration-300 transform-gpu translate-z-0 ${
          isScrambling
            ? 'text-cyan-400 dark:text-violet-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]'
            : 'text-neutral-800 dark:text-white drop-shadow-none'
        }`}
        style={{ transform: 'translate3d(0, 0, 0)' }}
      >
        {displayText}
      </span>
    </div>
  );
};
