# Wellness Clinic Admin (React + Supabase)

A small React single-page admin application for managing a wellness clinic’s operational database.  


---

## Features

### Operational CRUD screens

The app exposes simple admin screens for the main transactional tables:

- **Patients** – contact info, visit times, etc.
- **Staff** – staff info, roles, and specializations.
- **Rooms & Room Types** – examination rooms, procedure rooms, delivery, recovery, lab, pharmacy.
- **Coverage Plans** – insurer, plan type, copay, policy number, expiry.
- **Drugs** – DIN and drug name of drugs held in the pharmacy.
- **Appointments** – visit type, status, patient, and room.

Each CRUD page supports:

- Listing records.
- Creating new records with a form.
- Editing existing records.
- Deleting single records.

### Reporting and clinical views

The database includes several **read-only views** surfaced through simple React pages:

- **Daily Master Schedule/Appointments** 
  Combined view of every appointment time, staff, patient, room and room number for that day.
- **Weekly Staff Coverage**   
  Showing which clinicians are on call/covering each week.
- **Prescription History**  
  Showing the prescriptions given to various patients in the month.
- **Billing & Invoices**
  Showing all invoices and thier payment completion status
- **Monthly Activity Report** 
Showing all key actvity indicators.
- **Individual Practitioner Schedule**
Showing each practitioners schedule for the day.


---

## Tech stack

- **Frontend**
  - React
  - Vite
  - React Router
  - Tailwind CSS
- **Backend / Data**
  - Supabase (Postgres)
  - Supabase JS client

---

## Getting Started

-- Open Supabase and copy and paste the tableCreation.sql file contents into a sql script.
-- Copy the required ANON Key and URL to an .env to your host

From the project root:

```bash
npm install
npm run dev

```
-- The app should be running, and be on http://localhost:5173




