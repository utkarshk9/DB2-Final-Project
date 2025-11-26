import { Link } from "react-router-dom";

export default function AppHeader() {
  return (
    <header className="w-full bg-white border-b shadow-sm">
      {/* LEFT-aligned wrapper */}
      <div className="w-full px-8 py-4 flex items-center gap-10">

        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            ClinicalDB
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm font-medium">

          {/* Data */}
          <Link to="/crud/patient" className="nav-pill">Patients</Link>
          <Link to="/crud/appointments" className="nav-pill">Appointments</Link>
          <Link to="/crud/staff" className="nav-pill">Staff</Link>
          <Link to="/crud/rooms" className="nav-pill">Rooms</Link>
          <Link to="/crud/billing" className="nav-pill">Billing</Link>

          <span className="h-5 w-px bg-gray-300" />

          {/* Schedules */}
          <Link to="/crud/weekly_staff_calendar" className="nav-pill">Weekly Coverage</Link>
          <Link to="/crud/daily_schedule" className="nav-pill">Daily Master</Link>
          <Link to="/crud/vw_individual_practitioner_schedule" className="nav-pill">Practitioner Schedule</Link>

          <span className="h-5 w-px bg-gray-300" />

          {/* Reports */}
          <Link to="/crud/vw_daily_appointments" className="nav-pill">Daily View</Link>
          <Link to="/crud/vw_billing_invoices" className="nav-pill">Billing View</Link>
          <Link to="/crud/vw_prescription_history" className="nav-pill">Prescription View</Link>
          <Link to="/crud/vw_physician_insurance_statement" className="nav-pill">Insurance Forms</Link>
          <Link to="/crud/vw_patient_monthly_statement" className="nav-pill"> Patient Statements</Link>
          <Link to="/crud/vw_monthly_activity_report" className="nav-pill">Activity Report</Link>

        </nav>
      </div>
    </header>
  );
}