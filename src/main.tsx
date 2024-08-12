import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { DailyProvider } from "@daily-co/daily-react";
import { Analytics } from '@vercel/analytics/react';

import {
  createBrowserRouter,
  // createRoutesFromElements,
  RouterProvider,
  // Route,
} from 'react-router-dom'

import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import Login from "./components/Login.tsx";
import DashBoard from "./pages/dashboard.tsx";

// import Header from "./components/ui/header.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import App from "./App.tsx";


import "./global.css"; // Note: Core app layout can be found here

// Show warning on Firefox
// @ts-expect-error - Firefox is not supported
const isFirefox: boolean = typeof InstallTrigger !== "undefined";

// import { NextUIProvider } from '@nextui-org/react';

export const Layout = () => {

  return (
    <DailyProvider>
      <TooltipProvider>
        <main>
          {/* <Header /> */}
          <div id="app" className="bg-[#F0E6CF]">
            <App />
          </div>
          <Analytics />
        </main>
        <aside id="tray" />
      </TooltipProvider>
    </DailyProvider>
  );
};

const router = createBrowserRouter([
  {
      path: '/devices',
      element: (
          <ProtectedRoute>
              <Layout />
          </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
  },
  {
      path: '/login',
      element: <Login />,
      errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard',
    element:( <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>),
    errorElement: <ErrorPage />,
},
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isFirefox && (
      <div className="bg-red-500 text-white text-sm font-bold text-center p-2 fixed t-0 w-full">
        Voice activity detection not supported in Firefox. For best results,
        please use Chrome or Safari.
      </div>
    )}
    {/* <Layout /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
