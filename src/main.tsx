import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";
import "./index.css";
import { DesktopOnly } from "./components/desktop-only.tsx";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Toaster } from "./components/ui/sonner.tsx";

const history = createHashHistory()

// Create a new router instance
const router = createRouter({ routeTree, history });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <DesktopOnly>
        <RouterProvider router={router} />
        <Toaster/>
      </DesktopOnly>
    </StrictMode>,
  );
}
