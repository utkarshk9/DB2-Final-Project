import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
/**
 * Drug management page for viewing and editing drug records.
 * @returns {JSX.Element} Drug management page.
 */
export default function DrugPage() {
  // State variables for drug data, loading status, and editing state
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  // Function to load drug data from the database
  const loadDrugs = async () => {
    setLoading(true);
    // Fetch drug data ordered by din_id
    const { data, error } = await supabase
      .from("drug")
      .select("*")
      .order("din_id", { ascending: true });
    setLoading(false);
    // Set retrieved data to state if no error
    if (!error) setRows(data || []);
  };

  // Load drug data on component mount
  useEffect(() => {
    loadDrugs();
  }, []);

  // Function to handle saving (inserting/updating) drug records
  const handleSave = async (values) => {
    // Prepare payload for insertion/updating
    const payload = {
      drug_name: values.drug_name,
      din_id: values.din_id,
    };

    // Update existing record if drug_id is present in the table
    if (values.drug_id) {
      // update
      const { error } = await supabase
        .from("drug")
        .update(payload)
        //  update where din_id matches the desired record
        .eq("din_id", values.din_id);

      // Reload drug data upon successful update
      if (!error) {
        setEditing(null);
        loadDrugs();
      }
    } else {
      // Otherwise, insert a new drug record
      const { error } = await supabase.from("drug").insert(payload);
      // Reload drug data upon successful insertion
      if (!error) {
        setEditing(null);
        loadDrugs();
      }
    }
  };

  // Function to handle deleting a drug record
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("drug")
      .delete()
      // Delete drug record by desired din_id
      .eq("din_id", id);
    if (!error) loadDrugs();
  };

  // Return the DrugPage JSX element
  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div
        className="p-4  flex flex-col gap-3
    md:flex-row md:items-center md:justify-between
    border-b bg-white rounded-lg border-gray-100
    mb-6 px-4 py-2"
      >
        {/* The Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Drugs</h1>
          <p className="text-sm text-gray-500">
            A list of all drugs currently registered in the system.
          </p>
        </div>

        <button
          // Open form for new drug entry
          onClick={() => setEditing({})}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow"
        >
          + New drug
        </button>
      </div>

      {/* The  drug form for adding/editing */}
      {editing && (
        <div className="mb-4">
          
          <DrugForm
          // Passing initial values if there are any, save and cancel handlers to DrugForm
            initialValues={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {
      // If loading, show loading message
      loading ? (

        <div className="text-sm text-gray-500">Loading…</div>
      ) : 
      
      (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* else if no drugs found, show message */}
          {rows.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              No drugs found. Use “New drug” to add the first record.
            </div>
          ) : (
            // If existing drugs found, render the table
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Drug Indentification Number (DIN)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Drug Name
                  </th>

                  <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {/* Grab all drug rows */}
                {rows.map((row) => (
                  <tr
                    key={row.din_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.din_id}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.drug_name}
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
 * DrugForm component for adding/editing drug records
 * @param {Object} initialValues - Initial values for the form fields
 * @param {Function} onSave - Callback function to handle form submission
 * @param {Function} onCancel - Callback function to handle form cancellation
 * @returns {JSX.Element} Drug form JSX element
 */
function DrugForm({ initialValues = {}, onSave, onCancel }) {
  // State to manage form values
  const [values, setValues] = useState({
    din_id: initialValues.din_id || "",
    drug_name: initialValues.drug_name || "",
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Push updated value to state
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // send desired current values to onSave callback
    onSave(values);
  };

  // Return the form JSX element
  return (
    <form
      // When form is submitted, call handleSubmit function to process submission
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2"
    >
      <div>
        <label className="mb-1 block text-xs font-medium">
          Drug Indentification Number (DIN)
        </label>
        <input
          name="din_id"
          value={values.din_id}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Drug Name</label>
        <input
          name="drug_name"
          value={values.drug_name}
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
