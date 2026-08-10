import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Restore persisted compact view preference before first paint
if (localStorage.getItem("dyc-compact-view") === "true") {
  document.documentElement.classList.add("compact-view");
}

createRoot(document.getElementById("root")!).render(<App />);
