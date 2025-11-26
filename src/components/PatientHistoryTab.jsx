import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PatientHistoryTab({ patientId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [newText, setNewText] = useState("");

  const loadEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patient_history")
      .select("*")
      .eq("patient_id", patientId)
      .order("date", { ascending: false });

    if (error) console.error(error);
    else setEntries(data || []);

    setLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, [patientId]);

  const addEntry = async (e) => {
    e.preventDefault();
    if (!newDate || !newText) return;

    const { error } = await supabase.from("patient_history").insert({
      patient_id: patientId,
      date: newDate,
      history: newText,
    });

    if (error) {
      console.error(error);
      return;
    }

    setNewDate("");
    setNewText("");
    loadEntries();
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div>
      <form onSubmit={addEntry}>
        <div>
          <label>Date</label>
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
        </div>
        <div>
          <label>Note</label>
          <textarea value={newText} onChange={(e) => setNewText(e.target.value)} />
        </div>
        <button type="submit">Add Entry</button>
      </form>

      <hr />

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>History</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.history_id}>
              <td>{entry.date}</td>
              <td>{entry.history}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}