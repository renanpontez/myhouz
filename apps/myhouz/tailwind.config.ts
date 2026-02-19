import type { Config } from "tailwindcss";
import basePreset from "@home/config/tailwind/preset";

const config: Config = {
  presets: [basePreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  plugins: [],
};

export default config;
