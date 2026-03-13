import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { RouterProvider } from "react-router";
import { router } from "./config/router/index.tsx";
import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <Toaster position="top-right" richColors duration={1500} />
      <RouterProvider router={router} />
    </ReactQueryProvider>
  </StrictMode>,
);
