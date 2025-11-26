export const tableConfigs = {
  //
  // ─────────────────── CORE CRUD TABLES ───────────────────
  //

  // PATIENTS
  patient: {
    id: "patient",
    label: "Patients",
    table: "patient",
    primaryKey: "patient_id",
    defaultOrderBy: "patient_id",
    description: "Patient demographics and contact information.",
    fields: [
      { name: "patient_id", label: "Patient ID", inForm: false, inTable: true },
      { name: "first_name", label: "First name", type: "text", required: true },
      { name: "last_name", label: "Last name", type: "text", required: true },
      { name: "date_of_birth", label: "Date of birth", type: "date", required: true },
      { name: "phone_number", label: "Phone number", type: "text" },
      { name: "street_number", label: "Street number", type: "number" },
      { name: "street_name", label: "Street name", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "country", label: "Country", type: "text" },
      { name: "postal_code", label: "Postal code", type: "text" },
      { name: "time_in", label: "Time in", type: "time" },
      { name: "time_out", label: "Time out", type: "time" },
      { name: "insurance_info", label: "Insurance info", type: "textarea" },
      { name: "patient_history", label: "Patient history (legacy)", type: "textarea" },
    ],
  },

  // STAFF
  staff: {
    id: "staff",
    label: "Staff",
    table: "staff",
    primaryKey: "staff_id",
    defaultOrderBy: "staff_id",
    description: "Clinic staff members.",
    fields: [
      { name: "staff_id", label: "Staff ID", inForm: false, inTable: true },
      { name: "first_name", label: "First name", type: "text", required: true },
      { name: "last_name", label: "Last name", type: "text", required: true },
      {
        name: "role",
        label: "Role",
        type: "select",
        required: true,
        options: [
          "Physician",
          "Surgeon",
          "Nurse Practitioner",
          "Registered Nurse",
          "Midwife",
          "Lab Technician",
          "Pharmacist",
          "Admin",
          "Receptionist",
          "Bookkeeper",
        ],
      },
      { name: "specialization", label: "Specialization", type: "textarea" },
    ],
  },

  // ROOM TYPES
  room_types: {
    id: "room_types",
    label: "Room Types",
    table: "room_type",
    primaryKey: "room_type_id",
    defaultOrderBy: "room_type_id",
    description: "Room categories and descriptions.",
    fields: [
      { name: "room_type_id", label: "Room type ID", inForm: false, inTable: true },
      {
        name: "description",
        label: "Description",
        type: "select",
        options: [
          "Examination Room",
          "Surgery / Procedure Room",
          "Delivery Room",
          "Recovery Room",
          "Lab",
          "Pharmacy",
          "Admin / Office",
        ],
      },
    ],
  },

  rooms: {
  id: "rooms",
  label: "Rooms",
  table: "room",
  primaryKey: "room_id",
  defaultOrderBy: "room_id",
  description: "Physical rooms in the clinic.",
  fields: [
    { name: "room_id", label: "Room ID", inForm: false, inTable: true },
    { name: "room_number", label: "Room number", type: "number" },
    {
      name: "room_type_id",
      label: "Room type",
      type: "fk-select",
      required: true,
      foreignTable: "room_type",
      foreignLabel: "description",
      foreignValue: "room_type_id",
    },
  ],
},

  // APPOINTMENTS
  appointments: {
    id: "appointments",
    label: "Appointments",
    table: "appointments",
    primaryKey: "appointment_id",
    defaultOrderBy: "appointment_id",
    description: "Clinic appointments linking patients to rooms.",
    fields: [
      { name: "appointment_id", label: "Appointment ID", inForm: false, inTable: true },
      {
        name: "visit_type",
        label: "Visit type",
        type: "select",
        options: ["Consult", "Follow-up", "Surgery", "Procedure", "Lab", "Prenatal", "Delivery", "Other"],
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["scheduled", "checked_in", "completed", "cancelled", "no_show"],
      },
      { name: "patient_id", label: "Patient ID", type: "number", required: true },
      { name: "room_id", label: "Room ID", type: "number", required: true },
    ],
  },

  // DAILY SCHEDULE (link appointments ↔ staff)
  daily_schedule: {
    id: "daily_schedule",
    label: "Daily Schedule (Assignments)",
    table: "daily_schedule",
    primaryKey: "appointment_id", 
    defaultOrderBy: "time",
    description: "Links appointments to staff and specific times.",
    fields: [
      { name: "appointment_id", label: "Appointment ID", type: "number", required: true },
      { name: "staff_id", label: "Staff ID", type: "number", required: true },
      { name: "time", label: "Time", type: "time", required: true },
    ],
  },

  // WEEKLY STAFF CALENDAR
  weekly_staff_calendar: {
    id: "weekly_staff_calendar",
    label: "Weekly Staff Calendar",
    table: "weekly_staff_calendar",
    primaryKey: "calendar_id",
    defaultOrderBy: "calendar_id",
    description: "Weekly staff assignments and on-call status.",
    fields: [
      { name: "calendar_id", label: "Calendar ID", inForm: false, inTable: true },
      { name: "week_start", label: "Week start", type: "date", required: true },
      { name: "week_end", label: "Week end", type: "date", required: true },
      { name: "on_call", label: "On call", type: "checkbox" },
      { name: "staff_id", label: "Staff ID", type: "number", required: true },
    ],
  },

  // BILLING
  billing: {
    id: "billing",
    label: "Billing",
    table: "billing",
    primaryKey: "billing_id",
    defaultOrderBy: "billing_id",
    description: "Billing records for appointments.",
    fields: [
      { name: "billing_id", label: "Billing ID", inForm: false, inTable: true },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "payment_method",
        label: "Payment method",
        type: "select",
        required: true,
        options: ["Credit Card", "Debit", "Cash", "Insurance"],
      },
      {
        name: "payment_status",
        label: "Payment status",
        type: "select",
        required: true,
        options: ["paid", "unpaid", "pending"],
      },
      { name: "appointment_id", label: "Appointment ID", type: "number", required: true },
    ],
  },

  // INVOICES
  invoices: {
    id: "invoices",
    label: "Invoices",
    table: "invoice",
    primaryKey: "invoice_id",
    defaultOrderBy: "invoice_id",
    description: "Invoices generated from billing records.",
    fields: [
      { name: "invoice_id", label: "Invoice ID", inForm: false, inTable: true },
      { name: "issue_date", label: "Issue date", type: "date", required: true },
      { name: "billing_id", label: "Billing ID", type: "number", required: true },
    ],
  },

  // DRUGS
  drugs: {
    id: "drugs",
    label: "Drugs",
    table: "drug",
    primaryKey: "din_id",
    defaultOrderBy: "din_id",
    description: "Drug reference table.",
    fields: [
      { name: "din_id", label: "DIN ID", inForm: false, inTable: true },
      { name: "drug_name", label: "Drug name", type: "text" },
    ],
  },

  // PRESCRIPTIONS
  prescriptions: {
    id: "prescriptions",
    label: "Prescriptions",
    table: "prescription",
    primaryKey: "prescription_id",
    defaultOrderBy: "prescription_id",
    description: "Prescriptions issued for appointments.",
    fields: [
      { name: "prescription_id", label: "Prescription ID", inForm: false, inTable: true },
      { name: "issued_date", label: "Issued date", type: "date", required: true },
      { name: "appointment_id", label: "Appointment ID", type: "number", required: true },
    ],
  },

  // PRESCRIPTION ITEMS (link prescriptions ↔ drugs)
  prescription_items: {
    id: "prescription_items",
    label: "Prescription Items",
    table: "prescription_item",
    primaryKey: "din_id", 
    defaultOrderBy: "prescription_id",
    description: "Links prescriptions to drugs with quantities and dosage.",
    fields: [
      { name: "din_id", label: "DIN ID", type: "number", required: true },
      { name: "prescription_id", label: "Prescription ID", type: "number", required: true },
      { name: "quantity", label: "Quantity", type: "number", required: true },
      { name: "dosage_instructions", label: "Dosage instructions", type: "textarea" },
    ],
  },

  // LAB TESTS
  lab_tests: {
    id: "lab_tests",
    label: "Lab Tests",
    table: "lab_test",
    primaryKey: "lab_order_id",
    defaultOrderBy: "lab_order_id",
    description: "Lab test orders and results.",
    fields: [
      { name: "lab_order_id", label: "Lab order ID", inForm: false, inTable: true },
      { name: "test_name", label: "Test name", type: "text", required: true },
      {
        name: "result",
        label: "Result",
        type: "select",
        options: ["Normal", "Abnormal", "High", "Low", "Inconclusive"],
      },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "timestamp", label: "Time", type: "time", required: true },
      { name: "appointment_id", label: "Appointment ID", type: "number", required: true },
    ],
  },

  // LAB LOG 
  lab_logs: {
    id: "lab_logs",
    label: "Lab Logs",
    table: "lab_log",
    primaryKey: "lab_log_id",
    defaultOrderBy: "lab_log_date",
    description: "Daily lab log entries referencing lab tests.",
    fields: [
      { name: "lab_log_id", label: "Lab log ID", inForm: false, inTable: true },
      { name: "lab_log_date", label: "Log date", type: "date", required: true },
      { name: "lab_order_id", label: "Lab order ID", type: "number", required: true },
    ],
  },

  // RECOVERY ROOM ENTRIES
  recovery_room_entries: {
    id: "recovery_room_entries",
    label: "Recovery Room Entries",
    table: "recovery_room_entry",
    primaryKey: "recovery_id",
    defaultOrderBy: "recovery_id",
    description: "Recovery room admissions and discharges.",
    fields: [
      { name: "recovery_id", label: "Recovery ID", inForm: false, inTable: true },
      { name: "admit_timestamp", label: "Admit time", type: "time", required: true },
      { name: "discharge_timestamp", label: "Discharge time", type: "time", required: true },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "room_id", label: "Room ID", type: "number", required: true },
      { name: "staff_id", label: "Staff ID", type: "number", required: true },
    ],
  },

  // RECOVERY ROOM OBSERVATIONS
  recovery_room_observations: {
    id: "recovery_room_observations",
    label: "Recovery Room Observations",
    table: "recovery_room_observation",
    primaryKey: "observation_id",
    defaultOrderBy: "observation_id",
    description: "Observations recorded during recovery.",
    fields: [
      { name: "observation_id", label: "Observation ID", inForm: false, inTable: true },
      { name: "observation_timestamp", label: "Time", type: "time", required: true },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "recovery_id", label: "Recovery ID", type: "number", required: true },
    ],
  },

  // DELIVERY RECORD
  delivery_record: {
    id: "delivery_record",
    label: "Delivery Room Log",
    table: "delivery_record",
    primaryKey: "delivery_id",
    defaultOrderBy: "delivery_id",
    description: "Deliveries performed in the birthing room.",
    fields: [
      { name: "delivery_id", label: "Delivery ID", inForm: false, inTable: true },
      { name: "timestamp", label: "Delivery time", type: "time", required: true },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "room_id", label: "Room ID", type: "number", required: true },
    ],
  },

  // DIAGNOSIS
  diagnosis: {
    id: "diagnosis",
    label: "Diagnosis",
    table: "diagnosis",
    primaryKey: "diagnosis_id",
    defaultOrderBy: "diagnosis_id",
    description: "Diagnosis catalog.",
    fields: [
      { name: "diagnosis_id", label: "Diagnosis ID", inForm: false, inTable: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "treatment_plan", label: "Treatment plan", type: "textarea", required: true },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },

  // DIAGNOSIS ITEM (junction)
  diagnosis_item: {
    id: "diagnosis_item",
    label: "Diagnosis Items",
    table: "diagnosis_item",
    primaryKey: "diagnosis_id", 
    defaultOrderBy: "diagnosis_id",
    description: "Diagnosis assigned to appointments.",
    fields: [
      { name: "diagnosis_id", label: "Diagnosis ID", type: "number", required: true },
      { name: "appointment_id", label: "Appointment ID", type: "number", required: true },
    ],
  },

  // PATIENT HISTORY 
  patient_history: {
    id: "patient_history",
    label: "Patient History (Entries)",
    table: "patient_history",
    primaryKey: "history_id",
    defaultOrderBy: "date",
    description: "Free-text history entries per patient.",
    fields: [
      { name: "history_id", label: "History ID", inForm: false, inTable: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "history", label: "History note", type: "textarea", required: true },
      { name: "patient_id", label: "Patient ID", type: "number", required: true },
    ],
  },

  // COVERAGE PLAN
  coverage_plan: {
    id: "coverage_plan",
    label: "Coverage Plans",
    table: "coverage_plan",
    primaryKey: "coverage_code",
    defaultOrderBy: "coverage_code",
    description: "Insurance and coverage plans.",
    fields: [
      { name: "coverage_code", label: "Coverage code", inForm: false, inTable: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["Government", "Private", "Self-Pay"],
      },
      { name: "provider", label: "Provider", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "copay", label: "Copay %", type: "number" },
      { name: "policy_number", label: "Policy number", type: "text", required: true },
      { name: "policy_expiry", label: "Policy expiry", type: "date", required: true },
    ],
  },

  // PATIENT ↔ COVERAGE
  patient_coverage: {
    id: "patient_coverage",
    label: "Patient Coverage",
    table: "patient_coverage",
    primaryKey: "patient_id", 
    defaultOrderBy: "patient_id",
    description: "Mapping between patients and coverage plans.",
    fields: [
      { name: "patient_id", label: "Patient ID", type: "number", required: true },
      { name: "coverage_code", label: "Coverage code", type: "number", required: true },
    ],
  },




  //
  // ─────────────────── CORE CLINICAL VIEWS ───────────────────
  //

  // DAILY APPOINTMENTS VIEW
  vw_daily_appointments: {
    id: "vw_daily_appointments",
    label: "Daily Appointments View",
    table: "vw_daily_appointments",
    readOnly: true,
    primaryKey: null,
    defaultOrderBy: "appointment_id",
    description: "Read-only daily appointments summary including patient and staff.",
    fields: [
      { name: "appointment_id", label: "Appt ID" },
      { name: "patient_name", label: "Patient" },
      { name: "staff_names", label: "Assigned staff" },
      { name: "visit_type", label: "Visit type" },
      { name: "status", label: "Status" },
      { name: "room_id", label: "Room" },
    ],
  },

  // BILLING + INVOICES VIEW
  vw_billing_invoices: {
    id: "vw_billing_invoices",
    label: "Billing & Invoices View",
    table: "vw_billing_invoices",
    readOnly: true,
    primaryKey: null,
    defaultOrderBy: "issue_date",
    description: "Read-only consolidated billing and invoice information by appointment and patient.",
    fields: [
      { name: "invoice_id", label: "Invoice ID" },
      { name: "issue_date", label: "Issue date" },
      { name: "billing_id", label: "Billing ID" },
      { name: "billing_amount", label: "Amount" },
      { name: "payment_method", label: "Payment method" },
      { name: "payment_status", label: "Payment status" },
      { name: "appointment_id", label: "Appointment ID" },
      { name: "patient_name", label: "Patient name" },
    ],
  },

  // PRESCRIPTION HISTORY VIEW
  vw_prescription_history: {
    id: "vw_prescription_history",
    label: "Prescription History View",
    table: "vw_prescription_history",
    readOnly: true,
    primaryKey: null,
    defaultOrderBy: "issued_date",
    description: "Read-only prescription history by patient, appointment, and drug.",
    fields: [
      { name: "prescription_id", label: "Prescription ID" },
      { name: "issued_date", label: "Issued date" },
      { name: "appointment_id", label: "Appointment ID" },
      { name: "patient_name", label: "Patient name" },
      { name: "drug_name", label: "Drug name" },
      { name: "quantity", label: "Quantity" },
      { name: "instructions", label: "Dosage instructions" },
    ],
  },

  //
  // ─────────────────── SCHEDULE / COVERAGE VIEWS ───────────────────
  //

  // WEEKLY COVERAGE SCHEDULE
  vw_weekly_coverage_schedule: {
    id: "vw_weekly_coverage_schedule",
    label: "Weekly Coverage Schedule",
    table: "vw_weekly_coverage_schedule",
    readOnly: true,
    primaryKey: null,
    defaultOrderBy: "week_start",
    description: "Weekly staff coverage and on-call assignments.",
    fields: [
      { name: "week_start", label: "Week start" },
      { name: "week_end", label: "Week end" },
      { name: "on_call", label: "On call" },
      { name: "staff_id", label: "Staff ID" },
      { name: "first_name", label: "First name" },
      { name: "last_name", label: "Last name" },
      { name: "role", label: "Role" },
    ],
  },

  // DAILY MASTER SCHEDULE (whole clinic)
  vw_daily_master_schedule: {
    id: "vw_daily_master_schedule",
    label: "Daily Master Schedule",
    table: "vw_daily_master_schedule",
    readOnly: true,
    primaryKey: null,
    defaultOrderBy: "schedule_time",
    description: "Full clinic-wide daily schedule including all appointments and assignments.",
    fields: [
      { name: "schedule_time", label: "Time" },
      { name: "staff_first_name", label: "Staff first name" },
      { name: "staff_last_name", label: "Staff last name" },
      { name: "role", label: "Role" },
      { name: "visit_type", label: "Visit type" },
      { name: "status", label: "Status" },
      { name: "room_id", label: "Room" },
      { name: "patient_first_name", label: "Patient first name" },
      { name: "patient_last_name", label: "Patient last name" },
    ],
  },

  // INDIVIDUAL PRACTITIONER SCHEDULE
  vw_individual_practitioner_schedule: {
    id: "vw_individual_practitioner_schedule",
    label: "Individual Practitioner Schedule",
    table: "vw_individual_practitioner_schedule",
    readOnly: true,
    primaryKey: null,
    defaultOrderBy: "staff_id",
    description: "Per-practitioner daily schedule with patient and visit details.",
    fields: [
      { name: "staff_id", label: "Staff ID" },
      { name: "schedule_time", label: "Time" },
      { name: "patient_first_name", label: "Patient first name" },
      { name: "patient_last_name", label: "Patient last name" },
      { name: "visit_type", label: "Visit type" },
      { name: "status", label: "Status" },
      { name: "room_id", label: "Room" },
    ],
  },

  //
  // ─────────────────── MANAGEMENT / KPI VIEWS ───────────────────
  //

  // MONTHLY ACTIVITY REPORT
  vw_monthly_activity_report: {
    id: "vw_monthly_activity_report",
    label: "Monthly Activity Report",
    table: "vw_monthly_activity_report",
    readOnly: true,
    primaryKey: null,
    defaultOrderBy: "month_label",
    description:
      "Monthly roll-up of visits, surgeries/procedures, labs, deliveries, and prescriptions.",
    fields: [
      { name: "month_label", label: "Year-Month" },
      { name: "total_visits", label: "Total visits" },
      { name: "total_surgeries_procedures", label: "Surgeries / procedures" },
      { name: "total_lab_tests", label: "Lab tests" },
      { name: "total_prescriptions", label: "Prescriptions" },
    ],
  },

  //
  // ─────────────────── INSURANCE / FINANCIAL VIEWS ───────────────────
  //

  // PHYSICIAN INSURANCE STATEMENT
  vw_physician_insurance_statement: {
    id: "vw_physician_insurance_statement",
    label: "Physician Insurance Statement",
    table: "vw_physician_insurance_statement",
    readOnly: true,
    primaryKey: null,
    defaultOrderBy: "appointment_id",
    description:
      "Visit, coverage, diagnosis, and fee details formatted for insurance statement use.",
    fields: [
      // appointment + timing
      { name: "invoice_id", label: "Invoice ID" },
      { name: "issue_date", label: "Invoice date" },
      { name: "appointment_id", label: "Appt ID" },
      { name: "visit_type", label: "Visit type" },
      { name: "status", label: "Appointment Status" },


      // patient
      { name: "patient_id", label: "Patient ID" },
      { name: "patient_first_name", label: "Patient first" },
      { name: "patient_last_name", label: "Patient last" },
      { name: "insurance_info", label: "Insurance info" },
      { name: "coverage_code", label: "Coverage code" },
      { name: "coverage_provider", label: "Coverage provider" },
      { name: "coverage_type", label: "Coverage type" },
     
      // staff overseeing appointment
      {name:"staff_id", label: "Staff ID"},
      {name:"staff_first_name", label: "Staff first"},
      {name:"staff_last_name", label: "Staff last"},
      {name:"staff_role", label: "Staff role"},      
      {name:"specialization", label: "Specialization"},
      {name:"diagnosis_id", label: "Diagnosis ID"},
      {name:"diagnosis_description", label: "Diagnosis description"},
      {name:"treatment_plan", label: "Treatment plan"},

      // billing
      {name:"billing_id", label: "Billing ID"},
      {name:"fee_amount", label: "Fee amount"},
      {name:"payment_method", label: "Payment method"},
      {name:"payment_status", label: "Payment status"},
    ],
  },



  // PATIENT MONTHLY STATEMENT
  vw_patient_monthly_statement: {
    id: "vw_patient_monthly_statement",
    label: "Patient Monthly Statement",
    table: "vw_patient_monthly_statement",
    readOnly: true,
    primaryKey: null,
    defaultOrderBy: "month_start",
    description: "Per-patient monthly charges, payments, and outstanding balances.",
    fields: [
      { name: "patient_id", label: "Patient ID" },
      { name: "first_name", label: "First name" },
      { name: "last_name", label: "Last name" },
      { name: "month_label", label: "Month" },
      { name: "total_services", label: "Services" },
      { name: "total_charges", label: "Charges" },
      { name: "total_payments", label: "Payments" },
      { name: "outstanding_balance", label: "Outstanding" },
    ],
  },


};

// Flattened list of all table configs for routing and UI iteration.
export const tableList = Object.values(tableConfigs);

