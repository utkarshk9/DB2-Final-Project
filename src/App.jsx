// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CrudPage from "./components/CrudPage";
import PatientDetailPage from "./components/PatientDetailPage";
import AppHeader from "./components/AppHeader";

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />

      <Routes>
        <Route path="/" element={<Navigate to="/crud/patient" replace />} />
        <Route path="/crud/:tableId" element={<CrudPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}