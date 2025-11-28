import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
/**
 * Coverage management page for viewing and editing coverage plans.
 * @returns {JSX.Element} Coverage management page.
 */
export default function CoveragePage() {
  // State variables for coverage data, loading status, and editing state
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  // Function to load coverage data from the database
  const loadCoverage = async () => {
    setLoading(true);
    // Fetch the coverage_plan data ordered by coverage_code
    const { data, error } = await supabase
      .from("coverage_plan")
      .select("*")
      .order("coverage_code", { ascending: true });
    setLoading(false);
    // Update state with fetched data if no error occurred
    if (!error) setRows(data || []);
  };

  // Load coverage data on component mount
  useEffect(() => {
    loadCoverage();
  }, []);

  // Function to handle saving (inserting/updating) coverage records
  const handleSave = async (values) => {
    // Prepare payload from form values
    const payload = {
      type: values.type,
      provider: values.provider,
      description: values.description,
      copay: values.copay,
      policyNumber: values.policyNumber,
      policyExpiry: values.policyExpiry,
      coverage_code: values.coverage_code,
    };

    // Update existing record should coverage_code be present in the table
    if (values.coverage_code) {
      // Update the existing coverage record
      const { error } = await supabase
        .from("coverage_plan")
        .update(payload)
        // Identify record by the unique coverage_code
        .eq("coverage_code", values.coverage_code);

      // Reload coverage data upon successful update
      if (!error) {
        setEditing(null);
        loadCoverage();
      }
    } else {
      // Otherwise, insert a new coverage record
      const { error } = await supabase.from("coverage_plan").insert(payload);
      // Reload coverage data upon successful insert
      if (!error) {
        setEditing(null);
        loadCoverage();
      }
    }
  };

  // Function to handle deleting a coverage record
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("coverage_plan")
      .delete()
      // Delete coverage record by the unique coverage_code
      .eq("coverage_code", id);
    // Reload coverage data upon successful deletion
    if (!error) loadCoverage();
  };

  // Render the coverage management page
  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div
        className="p-4  flex flex-col gap-3
    md:flex-row md:items-center md:justify-between
    border-b bg-white rounded-lg border-gray-100
    mb-6 px-4 py-2"
      >
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Coverage Plans
          </h1>
          <p className="text-sm text-gray-500">
            A list of all coverage plans currently available.
          </p>
        </div>

        <button
          onClick={() => setEditing({})}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow"
        >
          + New coverage plan
        </button>
      </div>

      {editing && (
        <div className="mb-4">
          <CoverageForm
            initialValues={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* If data is still loading */}
      {loading ? (
        // Display loading indicator
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Otherwise, if there are no rows */}
          {rows.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              {/* show empty state */}
              No coverage plans found. Use “New coverage plan” to add the first
              record.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Provider
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Copay
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Policy Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Policy Expiry
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {/* Render each coverage row */}
                {rows.map((row) => (
                  <tr
                    key={row.coverage_code}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.type}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.provider}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.description}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.copay}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.policy_number}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.policy_expiry}
                    </td>
                    <td className="px-4 py-2 text-right text-xs">
                      <button
                        className="mr-3 font-medium text-blue-600 hover:text-blue-800"
                        // Set the current row for editing
                        onClick={() => setEditing(row)}
                      >
                        Edit
                      </button>
                      <button
                        className="font-medium text-red-600 hover:text-red-800"
                        // Handle deletion of the current row
                        onClick={() => handleDelete(row.coverage_code)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Coverage Form Component
 * @param {Object} initialValues - Initial values for the form fields.
 * @param {Function} onSave - Callback function to handle form submission.
 * @param {Function} onCancel - Callback function to handle form cancellation.
 * @returns
 */
function CoverageForm({ initialValues = {}, onSave, onCancel }) {
  // State for form values
  const [values, setValues] = useState({
    coverage_code: initialValues.coverage_code || "",
    type: initialValues.type || "",
    provider: initialValues.provider || "",
    description: initialValues.description || "",
    copay: initialValues.copay || "",
    policyNumber: initialValues.policy_number || "",
    policyExpiry: initialValues.policy_expiry || "",
  });

  // Function to handle input changes
  const handleChange = (e) => {
    // Destructure name and value from event target
    const { name, value } = e.target;
    // Update form values state
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(values);
  };

  // Render the coverage form
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2"
    >
      <div>
        <label className="mb-1 block text-xs font-medium">Coverage Code</label>
        <input
          name="first_name"
          value={values.first_name}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Type</label>
        <input
          name="type"
          value={values.type}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Provider</label>
        <input
          name="provider"
          value={values.provider}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Description</label>
        <input
          name="description"
          value={values.description}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Copay</label>
        <input
          name="copay"
          value={values.copay}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Policy Number</label>
        <input
          name="policy_number"
          value={values.policyNumber}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Policy Expiry</label>
        <input
          name="policy_expiry"
          value={values.policyExpiry}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      {/* Form Actions */}
      <div className="md:col-span-2 mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-blue-500 bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
