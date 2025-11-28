import { NavLink } from "react-router-dom";

/**
 * AppHeader component that displays the application header with navigation links.
 * @returns {JSX.Element} The application header with navigation links.
 */
export default function AppHeader() {

  // Styling for navigation links
  const base = "text-sm text-blue-700 hover:underline";
  const active = "font-semibold underline";

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="w-full px-8 py-4 flex items-center gap-10">
        
      {/* Our Logo */}
        <div className="text-xl font-semibold tracking-tight text-gray-900">
          ClinicalDB
        </div>

        {/* Creating the navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">

          {/* CRUD Section */}
          <NavLink
            to="/patients"
            className={({ isActive }) => 
              `${base} ${isActive ? active : ""}`
            }
          >
            Patients
          </NavLink>

          <NavLink
            to="/staff"
            className={({ isActive }) => 
              `${base} ${isActive ? active : ""}`
            }
          >
            Staff
          </NavLink>

          <NavLink
            to="/rooms"
            className={({ isActive }) => 
              `${base} ${isActive ? active : ""}`
            }
          >
            Rooms
          </NavLink>

          <NavLink
            to="/room-types"
            className={({ isActive }) => 
              `${base} ${isActive ? active : ""}`
            }
          >
            Room Types
          </NavLink>

          <NavLink
            to="/drugs"
            className={({ isActive }) => 
              `${base} ${isActive ? active : ""}`
            }
          >
            Drugs
          </NavLink>

          <NavLink
            to="/coverage"
            className={({ isActive }) => 
              `${base} ${isActive ? active : ""}`
            }
          >
            Coverage Plans
          </NavLink>

          {/* Divider */}
          <span className="h-5 w-px bg-gray-300" />

          {/* Schedule section made with view */}
          <NavLink
            to="/daily-schedule"
            className={({ isActive }) => 
              `${base} ${isActive ? active : ""}`
            }
          >
            Daily Schedule
          </NavLink>

          <NavLink
            to="/practitioner-schedule"
            className={({ isActive }) =>
              `${base} ${isActive ? active : ""}`
            }
          >
            Practitioner Schedule
          </NavLink>

          <NavLink
            to="/prescription-history"
            className={({ isActive }) =>
              `${base} ${isActive ? active : ""}`
            }
          >
            Prescription History
          </NavLink>

          {/* Divider */}
          <span className="h-5 w-px bg-gray-300" />

          {/* Reports sections made with views */}
          <NavLink
            to="/billing-view"
            className={({ isActive }) =>
              `${base} ${isActive ? active : ""}`
            }
          >
            Billing View
          </NavLink>

          <NavLink
            to="/monthly-activity"
            className={({ isActive }) =>
              `${base} ${isActive ? active : ""}`
            }
          >
            Monthly Activity
          </NavLink>
        </nav>
      </div>
    </header>
  );
}