import { useState, useEffect, useCallback } from 'react';

export function useFocusTimer() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setSessionCount((c) => c + 1);
      // Play a sound or notification here
      try {
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
      } catch (e) {
        // ignore audio errors
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = useCallback(() => setIsActive((prev) => !prev), []);
  
  const resetTimer = useCallback((minutes: number = 25) => {
    setIsActive(false);
    setTimeLeft(minutes * 60);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    isActive,
    timeLeft,
    formattedTime: formatTime(timeLeft),
    sessionCount,
    toggleTimer,
    resetTimer,
  };
}
