import React, { lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { fetchAllStateMetadata } from "./api/requests";

const States = lazy(() => import("./pages/States"));
const National = lazy(() => import("./pages/Us"));

function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    const localStorageData = sessionStorage.getItem("stateMetaData");
    if (!localStorageData) {
      fetchAllStateMetadata().then((data) =>
        sessionStorage.setItem("stateMetaData", JSON.stringify(data))
      );
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<National />} />
            <Route path="/us/" element={<National />} />
            <Route path="/us/:date" element={<National />} />
            <Route path="/states" element={<States />} />
            <Route path="/states/:date" element={<States />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
