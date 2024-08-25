"use client";
import React, { useState, useEffect } from "react";
import styles from "./Sparkles.module.css";

const DEFAULT_COLOR = "#FFC700";

const generateSparkle = (color) => ({
  id: String(Math.random()),
  createdAt: Date.now(),
  color,
  size: Math.random() * 10 + 5,
  style: {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    zIndex: Math.floor(Math.random() * 100),
  },
});

const Sparkle = ({ size, color, style }) => {
  const path =
    "M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z";

  return (
    <span style={style} className={styles.sparkle}>
      <svg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <path d={path} fill={color} />
      </svg>
    </span>
  );
};

const Sparkles = ({ color = DEFAULT_COLOR, children, ...delegated }) => {
  const [sparkles, setSparkles] = useState(() =>
    Array.from({ length: 3 }, () => generateSparkle(color)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const sparkle = generateSparkle(color);
      const nextSparkles = sparkles
        .filter((sp) => now - sp.createdAt < 750)
        .concat(sparkle);
      setSparkles(nextSparkles);
    }, 250);

    return () => clearInterval(interval);
  }, [color, sparkles]);

  return (
    <span className={styles.sparklesWrapper} {...delegated}>
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <span className={styles.childWrapper}>{children}</span>
    </span>
  );
};

export default Sparkles;
