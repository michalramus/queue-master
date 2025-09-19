import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import "./i18n";
import ReactQueryProvider from "./utils/providers/ReactQueryProvider.tsx";

import { ErrorBoundary } from "shared-components";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ReactQueryProvider>
            <ErrorBoundary onReset={() => window.location.reload()}>
                <App />
            </ErrorBoundary>
        </ReactQueryProvider>
    </StrictMode>,
);
