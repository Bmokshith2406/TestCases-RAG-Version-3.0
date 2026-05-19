import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../layout/AppShell";

export const router = createBrowserRouter(
  [
    {
      path: "/auth",
      lazy: async () => {
        const module = await import("../pages/auth/AuthPage");
        return { Component: module.default };
      },
    },
    {
      path: "/",
      element: <AppShell />,
      children: [
        {
          index: true,
          lazy: async () => {
            const module = await import("../pages/DashboardPage");
            return { Component: module.DashboardPage };
          },
        },
        {
          path: "search",
          lazy: async () => {
            const module = await import("../pages/SearchPage");
            return { Component: module.SearchPage };
          },
        },
        {
          path: "library",
          lazy: async () => {
            const module = await import("../pages/LibraryPage");
            return { Component: module.LibraryPage };
          },
        },
        {
          path: "upload",
          lazy: async () => {
            const module = await import("../pages/UploadPage");
            return { Component: module.UploadPage };
          },
        },
        {
          path: "scripts",
          lazy: async () => {
            const module = await import("../pages/ScriptsPage");
            return { Component: module.ScriptsPage };
          },
        },
        {
          path: "operations",
          lazy: async () => {
            const module = await import("../pages/OperationsPage");
            return { Component: module.OperationsPage };
          },
        },
      ],
    },
    {
      path: "*",
      lazy: async () => {
        const module = await import("../pages/NotFoundPage");
        return { Component: module.NotFoundPage };
      },
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
