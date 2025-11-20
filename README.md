# Wellness Clinic Admin (React + Supabase)

A small React single-page app that provides CRUD admin pages for a wellness clinic database using Supabase.

Entities implemented:

- Patients
- Appointments
- Diagnoses
- Prescriptions
- Drugs
- Billing
- Invoices
- Lab Orders
- Lab Results
- Coverage

## Tech stack

- React 18 + Vite
- React Router 6
- Supabase JS client (v2)
- Tailwind CSS for styling

## Getting started

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project (if you do not already have one).
2. In the Supabase dashboard, note your **Project URL** and **anon public key**.
3. In the project root, create a `.env.local` (or `.env`) file and set:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The app reads these from `import.meta.env` in `src/lib/supabaseClient.js`.

### 3. Create tables

Create tables in Supabase that match the names used in `src/config/tables.js`:

- `patients`
- `appointments`
- `diagnoses`
- `prescriptions`
- `drugs`
- `billing`
- `invoices`
- `lab_orders`
- `lab_results`
- `coverage`

Each table should at minimum have:

- A primary key column `id` (UUID or bigserial is recommended)
- The columns listed in that table's `fields` configuration in `src/config/tables.js`

You can adjust the field list, types, and labels in `src/config/tables.js` at any time to match your actual schema.

### 4. Run the dev server

```bash
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

## App structure

- `src/lib/supabaseClient.js` – Initializes the Supabase client using environment variables.
- `src/lib/crudService.js` – Wrapper functions for list, create, update, delete operations.
- `src/config/tables.js` – Central configuration for all entities (table name, primary key, fields).
- `src/components/CrudPage.jsx` – Generic CRUD page that renders a list and a form based on a table config.
- `src/components/LoadingSpinner.jsx` – Simple loading indicator.
- `src/components/ErrorAlert.jsx` – Simple error message component.
- `src/App.jsx` – App shell, navigation, and routing for each entity.

## Using and customizing the CRUD pages

- Navigation is generated from `tableConfigs` in `src/config/tables.js`.
- Each entry has:
  - `id` – used in the route path (e.g. `patients` -> `/patients`).
  - `table` – actual Supabase table name.
  - `primaryKey` – primary key column (defaults to `id`).
  - `fields` – array of field definitions used for forms and tables.

Field properties supported:

- `name` – column name in Supabase.
- `label` – human-friendly label.
- `type` – `text`, `textarea`, `number`, `date`, `datetime-local`, `email`, `tel`, or `select`.
- `options` – for `select` fields (array of option strings).
- `required` – whether the field is required in the form.
- `inForm` – set to `false` to hide from the form (e.g. `id`).
- `inTable` – set to `false` to hide from the list view.

You can extend these configs (for example, to add relational dropdowns for `patient_id`, `drug_id`, etc.) by fetching related data and providing options.

## Notes

- The CSS linter may warn about `@tailwind` and `@apply` in `src/index.css` if it is not Tailwind-aware; these directives are expected when using Tailwind with PostCSS.
- Error handling is basic by design; for production, you may want more granular validation and user feedback.
