/**
 * Main application component that sets up routing for the healthcare management system.
 */
 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppHeader from "./components/AppHeader";

// CRUD pages
import PatientPage from "./components/CRUDs/PatientPage.jsx";
import StaffPage from "./components/CRUDs/StaffPage.jsx";
import RoomTypePage from "./components/CRUDs/RoomTypePage.jsx";
import RoomPage from "./components/CRUDs/RoomPage.jsx";
import DrugPage from "./components/CRUDs/DrugPage.jsx";
import CoveragePage from "./components/CRUDs/CoveragePage.jsx";

// View and Report pages
import MonthlyActivityReportPage from "./components/Views/MonthlyActivityReportView.jsx";
import PrescriptionHistoryView from "./components/Views/PrescriptionHistoryView.jsx";
import IndividualPractitionerScheduleView from "./components/Views/IdivPractionerScheduleView.jsx";
import DailyScheduleView from "./components/Views/DailyAppointments.jsx";
import BillingAndInvoicesView from "./components/Views/Billing&InvoicesView.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        {/* catch-all */}
        <Route path="*" element={<Navigate to="/patients" replace />} />

        {/* CRUD pages */}
        <Route path="/patients" element={<PatientPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/room-types" element={<RoomTypePage />} />
        <Route path="/drugs" element={<DrugPage />} />
        <Route path="/coverage" element={<CoveragePage />} />

        {/* View / Report pages */}
        <Route
          path="/prescription-history"
          element={<PrescriptionHistoryView />}
        />
        <Route
          path="/practitioner-schedule"
          element={<IndividualPractitionerScheduleView />}
        />
        <Route path="/daily-schedule" element={<DailyScheduleView />} />
        <Route path="/billing-view" element={<BillingAndInvoicesView />} />
        <Route
          path="/monthly-activity"
          element={<MonthlyActivityReportPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
