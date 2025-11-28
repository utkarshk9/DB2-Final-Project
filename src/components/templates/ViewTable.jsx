import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

/**
 * ViewTable component for displaying data in a table format. This helps to make the view components more reusable.
 * @param {string} title - Title of the table.
 * @param {string} viewName - Name of the database view to fetch data from.
 * @param {string} orderBy - Column name to order the data by.
 * @param {Array} columns - Array of column definitions { key, label }.
 * @param {string} description - Optional description text for the table.
 * @returns {JSX.Element} ViewTable component.
 */
export default function ViewTable({
  title,
  viewName,
  orderBy,
  columns,
  description,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load data from the view
  const loadData = async () => {
    setLoading(true);
    setError("");

    // Building the query
    let query = supabase.from(viewName).select("*");
    // Apply filters if any
    if (orderBy) {
      query = query.order(orderBy, { ascending: true });
    }

    // Execute the query
    const { data, error } = await query;
    setLoading(false);

    // Handle errors
    if (error) {
      setError(error.message || "Failed to load data");
    } else {
      // Set the retrieved data to state if no error
      setRows(data || []);
    }
  };

  // Load data on component mount or when viewName/orderBy changes
  useEffect(() => {
    loadData();
  }, [viewName, orderBy]);

  return (
    // Table container
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div
        className="mb-6 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm
                   flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
      >
        <div>
          {/* Inserting title */}
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {/* Inserting description */}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>

      {/* IF the error state is set, show the error message */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table content */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* If loading, show loading state */}
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading…</div>
        ) : 
        // If no rows, show no data message
        rows.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            No data available.
          </div>
        ) : 
        // Render the table with data
        (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {/* Mapping header content to <th> elements */}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {/* Mapping row content to <tr> elements */}
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-2 text-xs text-gray-800"
                    >
                      {/* Inserting cell content with a formatter that handles null/undefined values */}
                      {formatCell(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Simple cell formatter to handle null/undefined values
function formatCell(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}
