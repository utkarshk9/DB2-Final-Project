import ViewTable from "../templates/ViewTable";
/**
 * Prescription History View component displaying prescription records.
 * @returns {JSX.Element} Prescription History View component displaying prescription records.
 */
export default function PrescriptionHistoryView() {
    return (
        <ViewTable
            title="Prescription History"
            viewName="vw_prescription_history"
            orderBy="patient_name"
            columns={[
                { key: "prescription_id", label: "Prescription ID" },
                { key: "issued_date", label: "Issued Date" },
                { key: "appointment_id", label: "Appointment ID" },
                { key: "patient_name", label: "Patient Name" },
                { key: "drug_name", label: "Medication" },
                { key: "instructions", label: "Instructions" },
                
            ]}
            description="A sorted view of all prescriptions given per patient. Currently it is sorted by patient name."
        />
    );
}