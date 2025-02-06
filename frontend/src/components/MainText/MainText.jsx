import './MainText.css';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MainText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const wordsRef = useRef([]);
  const animationDuration = `${speed}s`;

  useEffect(() => {
    if (!disabled) {
      gsap.fromTo(
        wordsRef.current,
        { scale: 1.4, opacity: 0, y: 60 },
        {
          delay: 2,
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 0.3,
          duration: 1,
          ease: 'power2.out',
        }
      );
    }
  }, [text, disabled]);

  return (
    <div
      className={`main-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{
        animationDuration,
        height: 'fit-content',
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
      }}
    >
      {text.split(' ').map((word, index) => (
        <span
          key={index}
          ref={(el) => (wordsRef.current[index] = el)}
          className='shiny-word'
          style={{
            whiteSpace: 'nowrap',
            wordBreak: 'break-word',
            maxWidth: '100%',
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </div>
  );
};

export default MainText;
