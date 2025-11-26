import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import RecordForm from "./RecordForm";

export default function TableView({ config, editingRow, setEditingRow }) {
  const {
    table,
    primaryKey,
    defaultOrderBy,
    fields,
    label,
    readOnly,
  } = config;

  const isReadOnly = !!readOnly;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const visibleFields = fields.filter((f) => f.inTable !== false);

  // Load table rows
  useEffect(() => {
    loadRows();
  }, [table]);

  async function loadRows() {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(defaultOrderBy || primaryKey || fields[0]?.name, {
        ascending: true,
      });

    if (error) {
      console.error(error);
      setRows([]);
      setError(error.message);
    } else {
      setRows(data || []);
      setError(null);
    }

    setLoading(false);
  }

  // Save new or edited record
  async function handleSave(values) {
    const isEdit = !!values[primaryKey];
    const payload = { ...values };

    if (!isEdit) delete payload[primaryKey];

    setSaving(true);
    let errorRes;

    if (isEdit) {
      const { error } = await supabase
        .from(table)
        .update(payload)
        .eq(primaryKey, values[primaryKey]);
      errorRes = error;
    } else {
      const { error } = await supabase.from(table).insert(payload);
      errorRes = error;
    }

    setSaving(false);

    if (errorRes) {
      alert("Save failed: " + errorRes.message);
      return;
    }

    await loadRows();
    setEditingRow(null);
  }

  // Delete record
  async function handleDelete(id) {
    if (!primaryKey) return;
    if (!window.confirm("Delete this record?")) return;

    setSaving(true);
    const { error } = await supabase.from(table).delete().eq(primaryKey, id);
    setSaving(false);

    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }

    await loadRows();

    if (editingRow && editingRow[primaryKey] === id) {
      setEditingRow(null);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      {/* TABLE SECTION – boxed card */}
      <div
        className={
          (isReadOnly ? "xl:col-span-3" : "xl:col-span-2") +
          " rounded-2xl bg-white border border-gray-200 shadow-sm p-5"
        }
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Records
            </h2>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
          {/* No "New" button here anymore – lives in page header */}
        </div>

        {/* TABLE WRAPPER — scrollable */}
        <div className="rounded-xl border border-gray-200 shadow-sm">
          <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {visibleFields.map((field) => (
                    <th
                      key={field.name}
                      className="px-4 py-2 text-left font-medium text-gray-600"
                    >
                      {field.label}
                    </th>
                  ))}

                  {!isReadOnly && (
                    <th className="px-4 py-2 text-right font-medium text-gray-600">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {/* LOADING */}
                {loading && (
                  <tr>
                    <td
                      colSpan={visibleFields.length + (isReadOnly ? 0 : 1)}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Loading…
                    </td>
                  </tr>
                )}

                {/* EMPTY */}
                {!loading && rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={visibleFields.length + (isReadOnly ? 0 : 1)}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No records found.
                    </td>
                  </tr>
                )}

                {/* DATA ROWS */}
                {rows.map((row, index) => (
                  <tr
                    key={primaryKey ? row[primaryKey] : index}
                    className="hover:bg-indigo-50/40 transition"
                  >
                    {visibleFields.map((field) => (
                      <td
                        key={field.name}
                        className="px-4 py-2 text-gray-800 whitespace-nowrap"
                      >
                        {String(row[field.name] ?? "")}
                      </td>
                    ))}

                    {!isReadOnly && (
                      <td className="px-4 py-2 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => setEditingRow(row)}
                          className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(row[primaryKey])}
                          className="inline-flex items-center rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-500">Error: {error}</p>
        )}
      </div>

      {/* FORM SECTION */}
      {!isReadOnly && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            {editingRow ? "Edit record" : `New ${label.replace(/s$/, "")}`}
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {editingRow
              ? "Update the fields and click Save."
              : "Fill out the form and click Save to create a new record."}
          </p>

          <RecordForm
            config={config}
            initialValues={editingRow || {}}
            saving={saving}
            onSave={handleSave}
            onCancel={() => setEditingRow(null)}
          />
        </div>
      )}
    </div>
  );
}