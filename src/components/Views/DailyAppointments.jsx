import ViewTable from "../templates/ViewTable";
/**
 * Daily Appointments View component displaying daily appointments.
 * @returns {JSX.Element} Daily Appointments View component displaying daily appointments.
 */
export default function DailyAppointmentsView() {
  return (
    <ViewTable
      description="A sorted view of all daily appointments including patient and physician details. Currently it is sorted by appointment time."
      title="Daily Appointments"
      viewName="vw_daily_appointments"
      orderBy="appointment_time"
      columns={[
        { key: "appointment_time", label: "Time" },
        { key: "staff_names", label: "Staff Names" },
        { key: "patient_name", label: "Patient Name" },
        { key: "visit_type", label: "Visit Type" },
        { key: "status", label: "Status" },
        { key: "room_id", label: "Room ID" },
        { key: "appointment_id", label: "Appointment ID" },
      ]}
    />
  );
}
