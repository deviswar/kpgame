import { memo, useMemo } from 'react';

interface WaveTextProps {
  text: string;
  className?: string;
  /** Character limit before switching to simple pulse animation (default: 20) */
  threshold?: number;
}

/**
 * Optimized WaveText - uses simple pulse for long strings to reduce DOM nodes
 */
const WaveText = memo(({ text, className, threshold = 20 }: WaveTextProps) => {
  // For long texts, use simple pulse to avoid creating N DOM elements
  if (text.length > threshold) {
    return (
      <span className={`${className || ''} animate-pulse`}>
        {text}
      </span>
    );
  }

  // For short texts, keep letter-by-letter wave animation
  const letters = useMemo(() => 
    text.split('').map((char, index) => ({
      char,
      delay: index * 0.05,
      isSpace: char === ' ',
    })),
    [text]
  );

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block animate-letter-wave"
          style={{ 
            animationDelay: `${letter.delay}s`,
            whiteSpace: letter.isSpace ? 'pre' : 'normal'
          }}
        >
          {letter.char}
        </span>
      ))}
    </span>
  );
});

WaveText.displayName = 'WaveText';

export default WaveText;
