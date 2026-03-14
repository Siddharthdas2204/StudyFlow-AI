"use client";

import { useEffect, useState } from "react";

export default function Background() {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; delay: string }[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <>
      <div className="nebula" />
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      {/* Shooting Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="shooting-star"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10 + i * 5}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .shooting-star {
          position: absolute;
          width: 2px;
          height: 100px;
          background: linear-gradient(to bottom, white, transparent);
          transform: rotate(45deg);
          opacity: 0;
          animation: shoot 15s infinite linear;
        }

        @keyframes shoot {
          0% { transform: rotate(45deg) translateY(-200px); opacity: 0; }
          1% { opacity: 1; }
          5% { transform: rotate(45deg) translateY(600px); opacity: 0; }
          100% { transform: rotate(45deg) translateY(600px); opacity: 0; }
        }
      `}</style>
    </>
  );
}
