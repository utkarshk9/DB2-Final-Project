/**
 * Root routing container for the Wellness Clinic App.
 */


// Importing necessary modules and components
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CrudPage from "./components/CrudPage";
import AppHeader from "./components/AppHeader";


export default function App() {
  return (
    // Setting up the router
    <BrowserRouter>
      <AppHeader />
      {/* Defining application routes */}
      <Routes>
        {/* Redirect root to default CRUD page */}
        <Route path="/" element={<Navigate to="/crud/patient" replace />} />
        {/* CRUD page for specific table */}
        <Route path="/crud/:tableId" element={<CrudPage />} />
      </Routes>
    </BrowserRouter>
  );
}