import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ["infinite-slider"]: "infiniteSlider 20s linear infinite",
      animation: {
        "sparkle-animation": "sparkle 1.5s ease-in-out infinite",
        text: "text 5s ease infinite",
      },
      keyframes: {
        sparkle: {
          "0%, 100%": { opacity: 0 },
          "50%": { opacity: 1 },
        },
        infiniteSlider: {
          "0%": { transform: "translateX(0)" },
          "100%": {
            transform: "translateX(calc(-250px * 5))",
          },
        },
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
            "background-image": "linear-gradient(to right, #00ff00, #0000ff)",
            color: "transparent",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
          },
          "25%": {
            "background-size": "200% 200%",
            "background-position": "center center",
            "background-image": "linear-gradient(to right, #ff69b4, #ffa07a)",
            color: "transparent",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
            "background-image": "linear-gradient(to right, #ffff00, #ff0000)",
            color: "transparent",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
          },
          "75%": {
            "background-size": "200% 200%",
            "background-position": "center center",
            "background-image": "linear-gradient(to right, #00ff00, #ff00ff)",
            color: "transparent",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
