/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#034BAE",
          "blue-tint": "#E8F0FC",
          "blue-hover": "#023985",
          orange: "#FF7420",
          "orange-tint": "#FFF1E8",
          "orange-hover": "#E56315",
          yellow: "#FFC93C",
          "yellow-tint": "#FFF6D6",
          tosca: "#0FA3A3",
          "tosca-tint": "#DDF5F3",
          purple: "#6D4AFF",
          "purple-tint": "#EEE9FF",
          coral: "#FF5C7A",
          "coral-tint": "#FFE6EB",
          navy: "#0B1F4D",
          neutral: "#F5F7FA",
          border: "#E3E8EF",
        },
        surface: {
          gray: "#F5F7FA",
          dark: "#0B1F4D",
          subtle: "#FAFBFC",
          card: "#FFFFFF",
        },
        ink: {
          main: "#0B1F4D", // Navy text as specified
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
        status: {
          success: "#16A34A",
          warning: "#F59E0B",
          error: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-plus-jakarta)", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.625rem", // ~10px
        xl: "0.75rem",  // 12px (radius kecil 8-12px)
      },
      boxShadow: {
        dropdown: "0 10px 25px -5px rgba(11, 31, 77, 0.1), 0 8px 10px -6px rgba(11, 31, 77, 0.1)",
        modal: "0 20px 40px -15px rgba(11, 31, 77, 0.25)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
