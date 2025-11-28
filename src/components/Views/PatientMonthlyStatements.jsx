import ViewTable from "../templates/ViewTable";
/**
 * Patient Monthly Statements View component displaying patient monthly statements.
 * @returns {JSX.Element} Patient Monthly Statements View component displaying patient monthly statements.
 */
export default function PatientMonthlyStatements() {
    return (
        <ViewTable
            title="Patient Monthly Statements"
            viewName="vw_patient_monthly_statements"
            orderBy="issue_date"
            columns={[
                {key: "issue_date", label: "Issue Date" },
                {key: "first_name", label: "Patient First Name" },
                {key: "last_name", label: "Patient Last Name" },
                {key:"month_label", label: "Statement Year and Month"},
                {key: "total_services", label: "Total Services" },
                {key: "total_charges", label: "Total Charges" },
                {key: "total_payments", label: "Total Payments" },
                {key : "outstanding_balance", label: "Outstanding Balance" },
            ]}
            description="A detailed view of all patient monthly statements ordered by issue date."
        />
    );
}