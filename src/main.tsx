
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { RentalProvider } from "./contexts/RentalContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ErrorBoundary>
      <AuthProvider>
        <RentalProvider>
          <App />
        </RentalProvider>
      </AuthProvider>
    </ErrorBoundary>
  </BrowserRouter>
);
