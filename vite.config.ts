import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "router";
            if (id.includes("@tanstack")) return "react-query";
            if (id.includes("@supabase")) return "supabase";
            if (id.includes("recharts")) return "charts";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("html2canvas")) return "html2canvas";
            if (id.includes("canvas-confetti")) return "confetti";
            if (id.includes("embla-carousel")) return "carousel";
            if (id.includes("@radix-ui")) return "radix-ui";
            if (id.includes("date-fns")) return "date-fns";
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("qrcode")) return "qrcode";
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
}));
