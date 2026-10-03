import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { store } from "./store/store";
import AppShell from "./layouts/AppShell";
import { Loader2 } from "lucide-react";

// Lazy-load pages for better initial load time
const Landing  = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Cyclones  = lazy(() => import("./pages/Cyclones"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <Loader2 size={28} className="animate-spin text-blue-400" />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cyclones" element={<Cyclones />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
