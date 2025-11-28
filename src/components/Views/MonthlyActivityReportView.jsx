import ViewTable from "../templates/ViewTable";
/**
 * Monthly Activity Report View component displaying key monthly activity metrics.
 * @returns {JSX.Element} Monthly Activity Report View component displaying monthly activity metrics.
 */
export default function MonthlyActivityReport() {
    return (
        <ViewTable
            title="Monthly Activity Report"
            viewName="vw_monthly_activity_report"
            orderBy="month_label"
            columns={[
                { key: "month_label", label: "Year - Month" },
                { key: "total_visits", label: "Total Visits" },
                { key: "total_surgeries_procedures", label: "Total Surgeries/Procedures" },
                { key: "total_births", label: "Total Births" },
                { key: "total_prescriptions", label: "Total Prescriptions Issued" },
                { key: "total_lab_tests", label: "Total Lab Tests Ordered" },
                { key: "avg_visit_duration_minutes", label: "Avg. Visit Duration (mins)" },
                
            ]}
            description="A summarized report of high-level monthly activity metrics."
        />
    );
}