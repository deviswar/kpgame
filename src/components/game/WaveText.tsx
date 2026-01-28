interface WaveTextProps {
  text: string;
  className?: string;
}

const WaveText = ({ text, className }: WaveTextProps) => {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block animate-letter-wave"
          style={{ 
            animationDelay: `${index * 0.05}s`,
            whiteSpace: char === ' ' ? 'pre' : 'normal'
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default WaveText;
