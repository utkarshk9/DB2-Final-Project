import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
/**
 * Patient management page for viewing and editing patient records.
 * @returns {JSX.Element} Patient management page.
 */

export default function PatientPage() {
  // State variables for patient data, loading status, and editing state
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  // Function to load patient data from the database
  const loadPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patient")
      .select("*")
      .order("patient_id", { ascending: true });
    setLoading(false);
    if (!error) setRows(data || []);
  };

  // Load patient data on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  // Function to handle saving (inserting/updating) patient records
  const handleSave = async (values) => {
    // Prepare payload for insertion/updating
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      date_of_birth: values.date_of_birth,
      phone_number: values.phone_number,
      street_number: values.street_number,
      street_name: values.street_name,
      city: values.city,
      country: values.country,
      postal_code: values.postal_code,
      time_in: values.time_in,
      time_out: values.time_out,
      insurance_info: values.insurance_info,
      patient_history: values.patient_history,
    };

    // If patient_id exists, update the existing record
    if (values.patient_id) {
      const { error } = await supabase
        .from("patient")
        .update(payload)
        // Update where patient_id matches the desired record
        .eq("patient_id", values.patient_id);

        // Reload patient data upon successful update
      if (!error) {
        setEditing(null);
        loadPatients();
      }
    } else {
      // Otherwise, insert a new patient record
      const { error } = await supabase.from("patient").insert(payload);
      if (!error) {
        setEditing(null);
        loadPatients();
      }
    }
  };

// Function to handle deleting a patient record
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("patient")
      .delete()
      // Delete patient record by desired patient_id
      .eq("patient_id", id);
      // Reload patient data upon successful deletion
    if (!error) loadPatients();
  };

  return (

    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div
        className="p-4  flex flex-col gap-3
    md:flex-row md:items-center md:justify-between
    border-b bg-white rounded-lg border-gray-100
    mb-6 px-4 py-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500">
            A list of all patients currently registered in the clinic.
          </p>
        </div>

        <button
          onClick={() => setEditing({})}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow"
        >
          + New patient
        </button>
      </div>

{/* If editing a patient, show the form */}
      {editing && (
        <div className="mb-4">
          <PatientForm
            initialValues={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

{/* If loading, show loading message */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* If no patients found, show message */}
          {rows.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              No patients found. Use “New patient” to add the first record.
            </div>
          ) : (
            // Otherwise, render the patient table
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
                    DOB
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Address
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {/* Grab all patient rows */}
                {rows.map((row) => (
                  <tr
                    key={row.patient_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.first_name}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.last_name}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.date_of_birth}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.phone_number}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.street_number} {row.street_name}, {row.city},{" "}
                      {row.country}, {row.postal_code}
                    </td>
                    <td className="px-4 py-2 text-right text-xs">
                      <button
                        className="mr-3 font-medium text-blue-600 hover:text-blue-800"
                        // Set the editing state to the selected row for editing
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
 * PatientForm component for adding/editing patient records
 * @param {Object} initialValues - Initial values for the form fields
 * @param {Function} onSave - Callback function to handle form submission
 * @param {Function} onCancel - Callback function to handle form cancellation
 * @returns {JSX.Element} Patient form JSX element
 */
function PatientForm({ initialValues = {}, onSave, onCancel }) {
  // State to manage form values
  const [values, setValues] = useState({
    patient_id: initialValues.patient_id,
    first_name: initialValues.first_name || "",
    last_name: initialValues.last_name || "",
    date_of_birth: initialValues.date_of_birth || "",
    phone_number: initialValues.phone_number || "",
    street_number: initialValues.street_number || "",
    street_name: initialValues.street_name || "",
    city: initialValues.city || "",
    country: initialValues.country || "",
    postal_code: initialValues.postal_code || "",
    time_in: initialValues.time_in || "",
    time_out: initialValues.time_out || "",
    insurance_info: initialValues.insurance_info || "",
    patient_history: initialValues.patient_history || "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    // Grab name and value from event target
    const { name, value } = e.target;
    // Update state with new value
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Call onSave callback with current form values
    onSave(values);
  };

  return (
    <form
    // When form is submitted, call handleSubmit function to process submission
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
        <label className="mb-1 block text-xs font-medium">Date of birth</label>
        <input
          type="date"
          name="date_of_birth"
          value={values.date_of_birth}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Phone</label>
        <input
          name="phone_number"
          value={values.phone_number}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Street number</label>
        <input
          type="number"
          name="street_number"
          value={values.street_number}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Street name</label>
        <input
          name="street_name"
          value={values.street_name}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">City</label>
        <input
          name="city"
          value={values.city}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Country</label>
        <input
          name="country"
          value={values.country}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Postal code</label>
        <input
          name="postal_code"
          value={values.postal_code}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Time in</label>
        <input
          type="time"
          name="time_in"
          value={values.time_in}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Time out</label>
        <input
          type="time"
          name="time_out"
          value={values.time_out}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium">Insurance info</label>
        <textarea
          name="insurance_info"
          value={values.insurance_info}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          rows={3}
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium">
          Patient history (legacy)
        </label>
        <textarea
          name="patient_history"
          value={values.patient_history}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          rows={3}
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
