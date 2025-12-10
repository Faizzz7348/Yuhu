import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("main.tsx: Starting app...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

console.log("main.tsx: Root element found, rendering app...");
createRoot(rootElement).render(<App />);
console.log("main.tsx: App rendered");
