
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { ApiModeProvider } from "./contexts/ApiModeContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { RentalProvider } from "./contexts/RentalContext.tsx";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ApiModeProvider>
          <AuthProvider>
            <RentalProvider>
              <App />
            </RentalProvider>
          </AuthProvider>
        </ApiModeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </BrowserRouter>
);
