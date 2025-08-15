import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./lib/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				bg: "#0b0f14",
				panel: "#11161a",
				border: "#1b2430",
				text: "#e6edf3",
				muted: "#93a4b7",
				accent: {
					500: "#3b82f6", // blue-500
					600: "#2563eb", // blue-600
				},
			},
			fontFamily: {
				sans: "var(--font-geist-sans)",
				mono: "var(--font-geist-mono)",
			},
		},
	},
	plugins: [],
};

export default config;


