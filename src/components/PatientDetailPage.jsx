import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import PatientHistoryTab from "./PatientHistoryTab.jsx";
import PatientVisitsTab from "./PatientVistsTab.jsx";   
import PatientBillingTab from "./PatientBillingTab.jsx";


export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    const loadPatient = async () => {
      const { data, error } = await supabase
        .from("patient")
        .select("*")
        .eq("patient_id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPatient(data);
      }
      setLoading(false);
    };

    loadPatient();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="patient-detail">
      <header>
        <h1>
          {patient.first_name} {patient.last_name}
        </h1>
        <p>DOB: {patient.date_of_birth}</p>
        <p>Phone: {patient.phone_number}</p>
        <p>City: {patient.city}</p>
      </header>

      <nav className="tabs">
        <button onClick={() => setActiveTab("summary")}>Summary</button>
        <button onClick={() => setActiveTab("history")}>History</button>
        <button onClick={() => setActiveTab("visits")}>Visits</button>
        <button onClick={() => setActiveTab("billing")}>Billing</button>
        {/* add Labs / Rx / etc as needed */}
      </nav>

      <section className="tab-content">
        {activeTab === "summary" && <div>Basic info, key metrics, etc.</div>}
        {activeTab === "history" && <PatientHistoryTab patientId={patient.patient_id} />}
        {activeTab === "visits" && <PatientVisitsTab patientId={patient.patient_id} />}
        {activeTab === "billing" && <PatientBillingTab patientId={patient.patient_id} />}
      </section>
    </div>
  );
}