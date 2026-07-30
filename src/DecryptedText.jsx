import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

const styles = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap'
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0
  }
};

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click');
  const [direction, setDirection] = useState('forward');

  const containerRef = useRef(null);
  const orderRef = useRef([]);
  const pointerRef = useRef(0);
  const intervalRef = useRef(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback(
    (originalText, currentRevealed) => {
      return originalText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(index)) return originalText[index];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [availableChars]
  );

  const computeOrder = useCallback(
    length => {
      const order = [];
      if (length <= 0) return order;
      if (revealDirection === 'start') {
        for (let i = 0; i < length; i++) order.push(i);
        return order;
      }
      if (revealDirection === 'end') {
        for (let i = length - 1; i >= 0; i--) order.push(i);
        return order;
      }

      const middle = Math.floor(length / 2);
      let offset = 0;
      while (order.length < length) {
        if (offset % 2 === 0) {
          const index = middle + offset / 2;
          if (index >= 0 && index < length) order.push(index);
        } else {
          const index = middle - Math.ceil(offset / 2);
          if (index >= 0 && index < length) order.push(index);
        }
        offset++;
      }
      return order.slice(0, length);
    },
    [revealDirection]
  );

  const fillAllIndices = useCallback(() => {
    const indices = new Set();
    for (let i = 0; i < text.length; i++) indices.add(i);
    return indices;
  }, [text]);

  const removeRandomIndices = useCallback((set, count) => {
    const items = Array.from(set);
    for (let i = 0; i < count && items.length > 0; i++) {
      const index = Math.floor(Math.random() * items.length);
      items.splice(index, 1);
    }
    return new Set(items);
  }, []);

  const encryptInstantly = useCallback(() => {
    const emptySet = new Set();
    setRevealedIndices(emptySet);
    setDisplayText(shuffleText(text, emptySet));
    setIsDecrypted(false);
  }, [text, shuffleText]);

  const triggerDecrypt = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
    }
    setRevealedIndices(new Set());
    setDirection('forward');
    setIsAnimating(true);
  }, [sequential, computeOrder, text.length]);

  const triggerReverse = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length).slice().reverse();
      pointerRef.current = 0;
      setRevealedIndices(fillAllIndices());
      setDisplayText(shuffleText(text, fillAllIndices()));
    } else {
      setRevealedIndices(fillAllIndices());
      setDisplayText(shuffleText(text, fillAllIndices()));
    }
    setDirection('reverse');
    setIsAnimating(true);
  }, [sequential, computeOrder, fillAllIndices, shuffleText, text]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;

    intervalRef.current = setInterval(() => {
      setRevealedIndices(previous => {
        if (sequential) {
          if (direction === 'forward') {
            if (previous.size < text.length) {
              const nextIndex = orderRef.current[previous.size] ?? previous.size;
              const next = new Set(previous);
              next.add(nextIndex);
              setDisplayText(shuffleText(text, next));
              return next;
            }
            clearInterval(intervalRef.current);
            setIsAnimating(false);
            setIsDecrypted(true);
            return previous;
          }

          if (pointerRef.current < orderRef.current.length) {
            const indexToRemove = orderRef.current[pointerRef.current++];
            const next = new Set(previous);
            next.delete(indexToRemove);
            setDisplayText(shuffleText(text, next));
            if (next.size === 0) {
              clearInterval(intervalRef.current);
              setIsAnimating(false);
              setIsDecrypted(false);
            }
            return next;
          }

          clearInterval(intervalRef.current);
          setIsAnimating(false);
          setIsDecrypted(false);
          return previous;
        }

        if (direction === 'forward') {
          setDisplayText(shuffleText(text, previous));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(intervalRef.current);
            setIsAnimating(false);
            setDisplayText(text);
            setIsDecrypted(true);
          }
          return previous;
        }

        let currentSet = previous;
        if (currentSet.size === 0) currentSet = fillAllIndices();
        const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
        const nextSet = removeRandomIndices(currentSet, removeCount);
        setDisplayText(shuffleText(text, nextSet));
        currentIteration++;
        if (nextSet.size === 0 || currentIteration >= maxIterations) {
          clearInterval(intervalRef.current);
          setIsAnimating(false);
          setIsDecrypted(false);
          setDisplayText(shuffleText(text, new Set()));
          return new Set();
        }
        return nextSet;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [isAnimating, text, speed, maxIterations, sequential, shuffleText, direction, fillAllIndices, removeRandomIndices]);

  const handleClick = () => {
    if (animateOn !== 'click') return;
    if (clickMode === 'once') {
      if (!isDecrypted) triggerDecrypt();
    } else if (isDecrypted) {
      triggerReverse();
    } else {
      triggerDecrypt();
    }
  };

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return;
    setRevealedIndices(new Set());
    setIsDecrypted(false);
    setDisplayText(text);
    setDirection('forward');
    setIsAnimating(true);
  }, [isAnimating, text]);

  const resetToPlainText = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection('forward');
  }, [text]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      });
    }, { threshold: 0.1 });

    const current = containerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  useEffect(() => {
    if (animateOn === 'click') {
      encryptInstantly();
    } else {
      setDisplayText(text);
      setIsDecrypted(true);
    }
    setRevealedIndices(new Set());
    setDirection('forward');
  }, [animateOn, text, encryptInstantly]);

  const animateProps =
    animateOn === 'hover' || animateOn === 'inViewHover'
      ? { onMouseEnter: triggerHoverDecrypt, onMouseLeave: resetToPlainText }
      : animateOn === 'click'
        ? { onClick: handleClick }
        : {};

  return (
    <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...animateProps} {...props}>
      <span style={styles.srOnly}>{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted);
          return (
            <span key={index} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
