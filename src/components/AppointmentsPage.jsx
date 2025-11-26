import TableView from "../components/TableView";
import { tableConfigs } from "../config/tables";

export default function AppointmentsPage() {
  const config = tableConfigs.find((c) => c.id === "appointments");

  if (!config) return <div>No config found for appointments.</div>;

  return (
    <div>
      <h1>{config.label}</h1>
      <TableView config={config} />
    </div>
  );
}