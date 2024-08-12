import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig({
  assetsInclude: ["**/*.onnx"],
  server: {
    cors:{ 
      origin: ['http://localhost:5173', 'https://us-central1-gemini-team.cloudfunctions.net/'], // Specify allowed domains
      methods: ['GET', 'POST'], // Allow specific methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    },
    headers: {
      "Cross-Origin-Embedder-Policy": "unsafe-none",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    webfontDownload(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/onnxruntime-web/dist/*.wasm",
          dest: "./",
        },
      ],
    }),

  ],
});
