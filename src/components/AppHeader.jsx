import { Link } from "react-router-dom";

export default function AppHeader() {
  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between gap-6">
        {/* LEFT: logo + title */}

          <span className="text-lg font-semibold  text-gray-900">
            ClinicalDB
          </span>
      
       
     

        {/* RIGHT: one long nav row */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {/* Core data */}
          <Link to="/crud/patient" className="text-gray-700 hover:text-blue-600">
            Patients
          </Link>
          <Link to="/crud/appointments" className="text-gray-700 hover:text-blue-600">
            Appointments
          </Link>
          <Link to="/crud/staff" className="text-gray-700 hover:text-blue-600">
            Staff
          </Link>
          <Link to="/crud/rooms" className="text-gray-700 hover:text-blue-600">
            Rooms
          </Link>
          <Link to="/crud/billing" className="text-gray-700 hover:text-blue-600">
            Billing
          </Link>

          {/* Divider */}
          <span className="h-5 w-px bg-gray-300" />

          {/* Schedules */}
          <Link
            to="/crud/weekly_staff_calendar"
            className="text-gray-700 hover:text-blue-600"
          >
            Weekly Coverage
          </Link>
          <Link
            to="/crud/daily_schedule"
            className="text-gray-700 hover:text-blue-600"
          >
            Daily Master
          </Link>
          <Link
            to="/crud/vw_practitioner_schedule"
            className="text-gray-700 hover:text-blue-600"
          >
            Practitioner
          </Link>

          {/* Divider */}
          <span className="h-5 w-px bg-gray-300" />

          {/* Reports / views */}
          <Link
            to="/crud/vw_daily_appointments"
            className="text-gray-700 hover:text-indigo-600"
          >
            Daily View
          </Link>
          <Link
            to="/crud/vw_billing_invoices"
            className="text-gray-700 hover:text-indigo-600"
          >
            Billing View
          </Link>
          <Link
            to="/crud/vw_prescription_history"
            className="text-gray-700 hover:text-indigo-600"
          >
            Prescription View
          </Link>
          
          <Link
            to="/crud/vw_physician_insurance_statement"
            className="text-gray-700 hover:text-indigo-600"
          >
            Insurance Forms
          </Link>

           <Link
            to="/crud/vw_individual_practitioner_schedule"
              className="text-gray-700 hover:text-indigo-600"
            >
              Individual Practitioner Schedule
            </Link>

          <Link
            to="/crud/vw_patient_monthly_statement"
            className="text-gray-700 hover:text-indigo-600"
          >
            Patient Statements
          </Link>
          <Link
            to="/crud/vw_monthly_activity_report"
            className="text-gray-700 hover:text-indigo-600"
          >
            Activity Report
          </Link>
        </nav>
      </div>
    </header>
  );
}