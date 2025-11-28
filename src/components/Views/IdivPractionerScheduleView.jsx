import ViewTable from "../templates/ViewTable";

/**
 * Individual Practitioner Schedule View component displaying practitioner schedule.
 * @returns {JSX.Element} Individual Practitioner Schedule View component displaying practitioner schedule.
 */
export default function IndividualPractitionerScheduleView() {
  return (
    <ViewTable
      title="Individual Practitioner Schedule"
      description="A detailed view of the schedule for a specific practitioner."
      viewName="vw_individual_practitioner_schedule"
      orderBy="staff_id"
      columns={[
        { key: "schedule_time", label: "Schedule Time" },
        { key: "appointment_id", label: "Appointment ID" },
        { key: "staff_first_name", label: "Staff First Name" },
        { key: "staff_last_name", label: "Staff Last Name" },
        { key: "visit_type", label: "Visit Type" },
        { key: "patient_first_name", label: "Patient First Name" },
        { key: "patient_last_name", label: "Patient Last Name" },
        { key: "room_id", label: "Room Number" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
