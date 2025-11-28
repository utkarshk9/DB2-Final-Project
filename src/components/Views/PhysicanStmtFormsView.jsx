import ViewTable from "../templates/ViewTable";
/**
 * Physician Insurance Statements View component displaying insurance statement records.
 * @returns {JSX.Element} Physician Insurance Statements View component displaying insurance statement records.
 */
export default function PhysicanInsuranceStatementsView() {
    return (
        <ViewTable
            title="Physician Insurance Statements"
            viewName="vw_physician_insurance_statements"
            orderBy="issue_date"
            columns={[
                {key: "issue_date", label: "Issue Date" },
                {key: "patient_first_name", label: "Patient First Name" },
                {key: "patient_last_name", label: "Patient Last Name" },
                {key: "staff_first_name", label: "Physician First Name" },
                {key: "staff_last_name", label: "Physician Last Name" },
                {key: "staff_role", label: "Physician Role" },
                {key:"specialization", label: "Area of Specialization"},
                {key: "appointment_date", label: "Appointment Date" },
                {key: "diagnosis_id", label: "Diagnosis Code" },
                {key: "diagnosis_description", label: "Diagnosis Description" },
                {key: "treatment_plan", label: "Treatment Plan" },
                {key: "fee_amount", label: "Statement Amount" },
                {key: "payment_method", label: "Payment Method" },
                {key: "payment_status", label: "Payment Status" },
            ]}
            description="A detailed view of physician insurance statements."
        />
    );
}