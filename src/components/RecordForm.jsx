
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function RecordForm({
  config,
  initialValues,
  onSave,
  onCancel,
  saving,
}) {
  const { fields, primaryKey } = config;

  const [values, setValues] = useState({});

  const [fkOptions, setFkOptions] = useState({});


  const formFields = fields.filter((f) => {
    if (f.name === primaryKey) return false;
    if (f.inForm === false) return false;
    return true;
  });

  // initialize values when editing / creating
  useEffect(() => {
    setValues(initialValues || {});
  }, [initialValues]);

  // load FK options for any field with type "fk-select"
  useEffect(() => {
    async function loadForeignKeyOptions() {
      const result = {};

      const fkFields = formFields.filter((f) => f.type === "fk-select");
      for (const field of fkFields) {
        const { foreignTable, foreignLabel, foreignValue } = field;
        if (!foreignTable || !foreignLabel || !foreignValue) continue;

        const { data, error } = await supabase
          .from(foreignTable)
          .select(`${foreignValue}, ${foreignLabel}`)
          .order(foreignLabel, { ascending: true });

        if (!error && data) {
          result[field.name] = data;
        } else if (error) {
          console.error(
            `Error loading FK options for ${field.name} from ${foreignTable}:`,
            error.message
          );
        }
      }

      setFkOptions(result);
    }

    loadForeignKeyOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table]); // reload if we switch to a different table config

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {formFields.map((field) => {
          const value = values[field.name] ?? "";

          const label = (
            <label
              key={field.name + "_label"}
              htmlFor={field.name}
              className="mb-1 block text-xs font-medium text-slate-700"
            >
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>
          );

          // -------- TEXTAREA --------
          if (field.type === "textarea") {
            return (
              <div key={field.name} className="flex flex-col">
                {label}
                <textarea
                  id={field.name}
                  value={value}
                  required={field.required}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="min-h-[70px] rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            );
          }

          // -------- STATIC SELECT (options in config) --------
          if (field.type === "select") {
            return (
              <div key={field.name} className="flex flex-col">
                {label}
                <select
                  id={field.name}
                  value={value}
                  required={field.required}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select…</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          // -------- FK SELECT (dynamic from another table) --------
          if (field.type === "fk-select") {
            const options = fkOptions[field.name] || [];
            return (
              <div key={field.name} className="flex flex-col">
                {label}
                <select
                  id={field.name}
                  value={value}
                  required={field.required}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select…</option>
                  {options.map((opt) => (
                    <option
                      key={opt[field.foreignValue]}
                      value={opt[field.foreignValue]}
                    >
                      {opt[field.foreignLabel]}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          // -------- CHECKBOX --------
          if (field.type === "checkbox") {
            return (
              <div key={field.name} className="flex items-center gap-2">
                <input
                  id={field.name}
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={field.name}
                  className="text-xs font-medium text-slate-700"
                >
                  {field.label}
                </label>
              </div>
            );
          }

          // -------- FALLBACK: regular input (text, number, date, time, etc.) --------
          const type =
            field.type && !["textarea", "select", "fk-select"].includes(field.type)
              ? field.type
              : "text";

          return (
            <div key={field.name} className="flex flex-col">
              {label}
              <input
                id={field.name}
                type={type}
                value={value}
                required={field.required}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}