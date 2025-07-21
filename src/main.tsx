import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import store from "./store/store.tsx";
import { Provider } from "react-redux";

if (import.meta.env.VITE_ENV === "production") {
  console.log = () => {}; // Disable console
  console.warn = () => {}; // Disable console
  console.error = () => {}; // Disable console
  console.info = () => {}; // Disable console
  console.debug = () => {}; // Disable console
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
