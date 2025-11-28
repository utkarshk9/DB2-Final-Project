import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

/**
 * Staff management page for viewing and editing staff members.
 * @returns {JSX.Element} Staff management page.
 */
export default function StaffPage() {
  // State variables for staff data, loading status, and editing state
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  // Function to load staff data from the database
  const loadStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("staff_id", { ascending: true });
    setLoading(false);
    if (!error) setRows(data || []);
  };

  // Load staff data on component mount
  useEffect(() => {
    loadStaff();
  }, []);

  // Function to handle saving (inserting/updating) staff records
  const handleSave = async (values) => {
    const payload = {
      staff_id: values.staff_id,
      first_name: values.first_name,
      last_name: values.last_name,
      role: values.role,
      specialization: values.specialization,
    };

    // Update existing record should staff_id be present in the table
    if (values.staff_id) {
      const { error } = await supabase
        .from("staff")
        .update(payload)
        .eq("staff_id", values.staff_id);

      // Reload staff data upon successful update
      if (!error) {
        setEditing(null);
        loadStaff();
      }
    }
    // Otherwise, insert a new staff record
    else {
      const { error } = await supabase.from("staff").insert(payload);
      if (!error) {
        setEditing(null);
        loadStaff();
      }
    }
  };

  // Function to handle deleting a staff record
  const handleDelete = async (id) => {
    // Delete staff record by staff_id
    const { error } = await supabase.from("staff").delete().eq("staff_id", id);
    // Reload staff data upon successful deletion
    if (!error) loadStaff();
  };

  // Render the staff management page
  return (
    // Main container
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      {/* Header */}
      <div
        className="p-4  flex flex-col gap-3
    md:flex-row md:items-center md:justify-between
    border-b bg-white rounded-lg border-gray-100
    mb-6 px-4 py-2"
      >
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Staff</h1>
          <p className="text-sm text-gray-500">
            A list of all staff members currently working in the clinic.
          </p>
        </div>

        <button
          onClick={() => setEditing({})}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow"
        >
          + New staff member
        </button>
      </div>

      {/* Show the form when editing a staff member and load the initial values if there are any */}
      {editing && (
        <div className="mb-4">
          <StaffForm
            initialValues={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* If loading data */}
      {loading ? (
        // show loading state
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* else if there are no rows found */}
          {rows.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              No staff members found. Use “New staff member” to add the first
              record.
            </div>
          ) : (
            // else render the table with data
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    First name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Last name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Specialization
                  </th>

                  <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {/* Mapping staff rows to table rows */}
                {rows.map((row) => (
                  <tr
                    key={row.staff_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.first_name}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.last_name}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.role}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.specialization}
                    </td>

                    <td className="px-4 py-2 text-right text-xs">
                      <button
                        className="mr-3 font-medium text-blue-600 hover:text-blue-800"
                        onClick={() => setEditing(row)}
                      >
                        Edit
                      </button>
                      <button
                        className="font-medium text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(row.patient_id)}
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
 * StaffForm component for adding/editing staff members.
 * @param {Object} initialValues - Initial values for the form fields.
 * @param {Function} onSave - Callback function to handle form submission.
 * @param {Function} onCancel - Callback function to handle form cancellation.
 * @returns Staff form JSX element.
 */
function StaffForm({ initialValues = {}, onSave, onCancel }) {
  // State for form values
  const [values, setValues] = useState({
    staff_id: initialValues.staff_id,
    first_name: initialValues.first_name || "",
    last_name: initialValues.last_name || "",
    role: initialValues.role || "",
    specialization: initialValues.specialization || "",
  });

  // Function to handle input changes
  const handleChange = (e) => {
    // Destructure name and value from event target
    const { name, value } = e.target;
    // Update form values state from previous state
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Call onSave callback with current form values
    onSave(values);
  };

  return (
    // Form element with grid layout
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2"
    >
      <div>
        <label className="mb-1 block text-xs font-medium">First name</label>
        <input
          name="first_name"
          value={values.first_name}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Last name</label>
        <input
          name="last_name"
          value={values.last_name}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Role</label>
        <input
          name="role"
          value={values.role}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Specialization</label>
        <input
          name="specialization"
          value={values.specialization}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

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
