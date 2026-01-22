import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "LostSaleWidget",
      fileName: "widget",
      formats: ["iife"], // output as an immediately invoked function expression for direct browser inclusion
    },
    outDir: "../public", // Output to the public folder for easy hosting/testing
    emptyOutDir: false, // Don't wipe the whole public dir
    sourcemap: true, // Useful for dev, maybe disable for prod later
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production"
    ),
  },
});
