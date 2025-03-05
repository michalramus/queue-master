import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import "./i18n";
import ReactQueryProvider from "./utils/providers/ReactQueryProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ReactQueryProvider>
            <App />
        </ReactQueryProvider>
    </StrictMode>,
);
