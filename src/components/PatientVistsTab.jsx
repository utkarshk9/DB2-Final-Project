import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PatientVisitsTab({ patientId }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", patientId)
        .order("date", { ascending: false });

      if (error) console.error(error);
      else setAppointments(data || []);
    };

    load();
  }, [patientId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Visit Type</th>
          <th>Status</th>
          <th>Room</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appt) => (
          <tr key={appt.appointment_id}>
            <td>{appt.date}</td>
            <td>{appt.visit_type}</td>
            <td>{appt.status}</td>
            <td>{appt.room_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}