// components/Hero.js
import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import Sparkles from "../Effects/Sparkle";
import styles from "../../Hero.module.css";

const Hero = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.gradientBorder}>
          <a href="#" className={styles.introLink}>
            <span className="mr-2">🎉</span>
            <span className={styles.gradientText}>Introducing GreesyChat</span>

            <FaArrowRight className={styles.arrowIcon} />
          </a>
        </div>

        <h1 className={styles.mainHeading}>
          New{" "}
          <span className={`${styles.animateText} text-animate animate-text`}>
            GenAI
          </span>{" "}
          Models
          <br />
          for Community
        </h1>

        <p className={styles.subHeading}>API Support coming soon.</p>

        <div className={styles.buttonWrapper}>
          <button className={styles.getStartedButton}>
            Get Started <FaArrowRight className={styles.buttonIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
