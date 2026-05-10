import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import { WalletContextProvider } from "./solana/WalletContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </HelmetProvider>
  </StrictMode>
);
