"use client";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import Sparkles from "../Effects/Sparkle";
import styles from "../../Hero.module.css";
import { useRouter } from "next/navigation";
const Hero = () => {
  const router = useRouter();
  return (
    <div className={styles.heroContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.gradientBorder}>
          <a href="#" className={styles.introLink}>
            <span className="mr-2">🎉</span>
            <span onClick={()=>router.get("https://huggingface.co/OnlyCheeini/greesychat-turbo")} className={styles.gradientText}>Introducing GreesyChat</span>

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

        <p className={styles.subHeading}>Beta Version</p>

        <div className={styles.buttonWrapper}>
          <button
            onClick={() => router.push("/blog/getting-started")}
            className={styles.getStartedButton}
          >
            Get Started <FaArrowRight className={styles.buttonIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
