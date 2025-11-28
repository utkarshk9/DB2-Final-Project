import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
/**
 * Room management page for viewing and editing room records.
 * @returns {JSX.Element} Room management page.
 */
export default function RoomPage() {
  // State variables for room data, loading status, and editing state
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  // Function to load room data from the database
  const loadRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("room")
      .select("*")
      .order("room_id", { ascending: true });
    setLoading(false);
    // Set retrieved data to state if no error
    if (!error) setRows(data || []);
  };

  // Load room data on component mount
  useEffect(() => {
    loadRooms();
  }, []);

  // Function to handle saving (inserting/updating) room records
  const handleSave = async (values) => {
    const payload = {
     room_id: values.room_id,
     room_number: values.room_number,
     room_type_id: values.room_type_id,
    };

    // Update existing record if room_id is present in the table
    if (values.room_id) {
      const { error } = await supabase
        .from("room")
        .update(payload)
        // update where room_id matches the desired record
        .eq("room_id", values.room_id);

        // Reload room data upon successful update
      if (!error) {
        setEditing(null);
        loadRooms();
      }
    } else {
      // Otherwise, insert a new room record
      const { error } = await supabase.from("room").insert(payload);
      if (!error) {
        setEditing(null);
        loadRooms();
      }
    }
  };

  // Function to handle deleting room records
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("room")
      .delete()
      // delete where room_id matches the desired record
      .eq("room_id", id);
    if (!error) loadRooms();
  };

  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div
        className="p-4  flex flex-col gap-3
    md:flex-row md:items-center md:justify-between
    border-b bg-white rounded-lg border-gray-100
    mb-6 px-4 py-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Rooms</h1>
          <p className="text-sm text-gray-500">
            A list of all rooms currently available in the clinic.
          </p>
        </div>

        <button
          onClick={() => setEditing({})}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow"
        >
          + New room
        </button>
      </div>

{/* Show the form when editing a room and load the initial values if there are any */}
      {editing && (
        <div className="mb-4">
          <RoomForm
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

          {/* If no rooms found, show message */}
          {rows.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              No rooms found. Use “New room” to add the first record.
            </div>
          ) : (
            // Else, show the table of rooms
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Room ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Room Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Room Type ID
                  </th>
                  
                  <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {/* Grab all room rows */}
                {rows.map((row) => (
                  <tr
                    key={row.room_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.room_id}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900">
                      {row.room_number}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700">
                      {row.room_type_id}
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
 * Room form component for adding/editing room records
 * @param {Object} initialValues - Initial values for the form fields
 * @param {Function} onSave - Callback function to handle form submission
 * @param {Function} onCancel - Callback function to handle form cancellation
 * @returns {JSX.Element} Room form JSX element
 */
function RoomForm({ initialValues = {}, onSave, onCancel }) {
  // State to manage form values
  const [values, setValues] = useState({
    room_id: initialValues.room_id || "",
    room_number: initialValues.room_number || "",
    room_type_id: initialValues.room_type_id || "",
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
    e.preventDefault();
    onSave(values);
  };

  return (
    <form
    // On form submission, call handleSubmit function to process submission
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2"
    >
      <div>
        <label className="mb-1 block text-xs font-medium">Room ID</label>
        <input
          name="first_name"
          value={values.room_id}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Room Number</label>
        <input
          name="last_name"
          value={values.room_number}
          onChange={handleChange}
          className="w-full rounded-md border px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Room Type</label>
        <input
          name="room_type_id"
          value={values.room_type_id}
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
