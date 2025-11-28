import ViewTable from "../templates/ViewTable";

/**
 * Billing and Invoices View component displaying billing and invoice details.
 * @returns {JSX.Element} Billing and Invoices View component displaying billing and invoice details.
 */
export default function BillingANDInvoicesViewPage() {
  return (
    <ViewTable
      title="Billing and Invoices"
      description="Consolidated billing and invoice details by appointment and patient which is sorted by issue date."
      viewName="vw_billing_invoices"
      orderBy="issue_date"
      columns={[
        { key: "patient_name", label: "Patient name" },
        { key: "invoice_id", label: "Invoice ID" },
        { key: "billing_id", label: "Billing ID" },
        { key: "appointment_id", label: "Appointment ID" },
        { key: "issue_date", label: "Issue date" },
        { key: "billing_amount", label: "Amount" },
        { key: "payment_method", label: "Payment method" },
        { key: "payment_status", label: "Payment status" },
      ]}
    />
  );
}
