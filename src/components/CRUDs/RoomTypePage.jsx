import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
/**
 * Room type management page for viewing and editing room type records.
 * @returns {JSX.Element} Room type management page.
 */
export default function RoomTypePage() {
  // State variables for room type data, loading status, and editing state
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  // Function to load room type data from the database
  const loadRoomTypes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("room_type")
      .select("*")
      .order("room_type_id", { ascending: true });
    setLoading(false);
    // Set retrieved data to state if no error
    if (!error) setRows(data || []);
  };

  // Load room type data on component mount
  useEffect(() => {
    loadRoomTypes();
  }, []);

  // Function to handle saving (inserting/updating) room type records
  const handleSave = async (values) => {
    const payload = {
      room_type_id: values.room_type_id,
      description: values.description,
    };

    if (values.room_type_id) {
      const { error } = await supabase
        .from("room_type")
        .update(payload)
        // update where room_type_id matches the desired record
        .eq("room_type_id", values.room_type_id);

        // Reload room type data upon successful update
      if (!error) {
        setEditing(null);
        loadRoomTypes();
      }
    } else {
      // Otherwise, insert a new room type record
      const { error } = await supabase.from("room_type").insert(payload);
      // Reload room type data upon successful insertion
      if (!error) {
        setEditing(null);
        loadRoomTypes();
      }
    }
  };

  // Function to handle deleting room type records
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("room_type")
      .delete()
      // Delete where room_type_id matches the desired record
      .eq("room_type_id", id);
    if (!error) loadRoomTypes();
  };

  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div
        className="p-4  flex flex-col gap-3
    md:flex-row md:items-center md:justify-between
    border-b bg-white rounded-lg border-gray-100
    mb-6 px-4 py-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Room Types</h1>
          <p className="text-sm text-gray-500">
            A list of all room types available in the clinic.
          </p>
        </div>

        <button
          onClick={() => setEditing({})}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow"
        >
          + New room type
        </button>
      </div>

{/* Show the form when editing a room type and load the initial values if there are any */}
      {editing && (
        <div className="mb-4">
          <RoomTypeForm
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
          {/* If no room types found, show message */}
          {rows.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              No room types found. Use “New room type” to add the first record.
            </div>
          ) : (
            // Else, show the table of room types
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Room Type ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Description
                  </th>
                  
                  <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {/* Grab all room type rows */}
                {rows.map((row) => (
                  <tr
                    key={row.room_type_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.room_type_id}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.description}
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
 * Room type form component for adding/editing room type records
 * @param {Object} initialValues - Initial values for the form fields
 * @param {Function} onSave - Callback function to handle form submission
 * @param {Function} onCancel - Callback function to handle form cancellation
 * @returns {JSX.Element} Room type form for adding/editing room type records
 */
function RoomTypeForm({ initialValues = {}, onSave, onCancel }) {
  const [values, setValues] = useState({
    room_type_id: initialValues.room_type_id || "",
    description: initialValues.description || "",
  });

  // Handle for form field changes
  const handleChange = (e) => {
    // Grab name and value from event target
    const { name, value } = e.target;
    // Push updated value to state
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle for form submission
  const handleSubmit = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Call onSave callback with current form values
    onSave(values);
  };

  return (
    // Form container
    <form
      //  Upon pressing the submit button, call handleSubmit function to process submission
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2"
    >
      <div>
        <label className="mb-1 block text-xs font-medium">Room Type ID</label>
        <input
          name="room_type_id"
          value={values.room_type_id}
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
