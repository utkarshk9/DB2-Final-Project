import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tableConfigs } from "../config/tables";
import TableView from "./TableView";

export default function CrudPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  // Fallback to "patient" if URL is missing/invalid
  const currentId = tableId && tableConfigs[tableId] ? tableId : "patient";
  const config = tableConfigs[currentId];

  if (tableId !== currentId) {
    navigate(`/crud/${currentId}`, { replace: true });
  }

  const [editingRow, setEditingRow] = useState(null);

  if (!config) {
    return (
      <div className="px-6 py-6 lg:px-10 lg:py-8">
        <p className="text-red-600 font-semibold">Table not found</p>
        <p className="text-sm text-gray-500">
          No config exists for: {currentId}
        </p>
      </div>
    );
  }

  const isReadOnly = !!config.readOnly;

  // "Patients" → "Patient", "Billing & Invoices View" → "Billing & Invoices"
  const singularLabel = config.label.replace(/ View$/i, "").replace(/s$/, "");

  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8 space-y-4">
      {/* PAGE HEADER */}

      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {config.label}
          </h1>

          {config.description && (
            <p className="mt-1 text-sm text-gray-500">{config.description}</p>
          )}

          {isReadOnly && (
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Read-only view
            </p>
          )}
        </div>

        {!isReadOnly && (
          <button
            onClick={() => setEditingRow(null)}
            className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            New {singularLabel}
          </button>
        )}
      </div>

      {/* TABLE + FORM LAYOUT */}
      <TableView
        config={config}
        editingRow={editingRow}
        setEditingRow={setEditingRow}
      />
    </div>
  );
}
