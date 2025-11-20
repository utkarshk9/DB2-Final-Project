import { useEffect, useMemo, useState } from 'react';
import { listRecords, createRecord, updateRecord, deleteRecord } from '../lib/crudService';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

function buildInitialValues(fields, record) {
  const values = {};
  fields.forEach((field) => {
    const value = record ? record[field.name] : '';
    values[field.name] = value == null ? '' : value;
  });
  return values;
}

export default function CrudPage({ config }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState(() => buildInitialValues(config.fields, null));
  const [editingRecord, setEditingRecord] = useState(null);

  const formFields = useMemo(
    () => config.fields.filter((f) => f.inForm !== false),
    [config.fields]
  );

  const tableFields = useMemo(
    () => config.fields.filter((f) => f.inTable !== false),
    [config.fields]
  );

  useEffect(() => {
    setFormValues(buildInitialValues(formFields, null));
    setEditingRecord(null);
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table]);

  async function loadRecords() {
    setLoading(true);
    setError('');
    try {
      const data = await listRecords(config.table, {
        orderBy: config.defaultOrderBy || config.primaryKey,
        ascending: true,
      });
      setRecords(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event, field) {
    const value = event.target.value;
    setFormValues((prev) => ({ ...prev, [field.name]: value }));
  }

  function resetForm() {
    setFormValues(buildInitialValues(formFields, null));
    setEditingRecord(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {};
      formFields.forEach((field) => {
        if (field.readOnly) return;
        let value = formValues[field.name];
        if (value === '') {
          value = null;
        }
        if (field.type === 'number' && value != null) {
          const parsed = Number(value);
          value = Number.isNaN(parsed) ? null : parsed;
        }
        payload[field.name] = value;
      });

      if (editingRecord) {
        await updateRecord(config.table, config.primaryKey, editingRecord[config.primaryKey], payload);
      } else {
        await createRecord(config.table, payload);
      }

      resetForm();
      await loadRecords();
    } catch (err) {
      setError(err.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(record) {
    setEditingRecord(record);
    setFormValues(buildInitialValues(formFields, record));
  }

  async function handleDelete(record) {
    const id = record[config.primaryKey];
    if (!window.confirm('Delete this record?')) return;

    setError('');
    try {
      await deleteRecord(config.table, config.primaryKey, id);
      if (editingRecord && editingRecord[config.primaryKey] === id) {
        resetForm();
      }
      await loadRecords();
    } catch (err) {
      setError(err.message || 'Failed to delete record');
    }
  }

  function renderInput(field) {
    const value = formValues[field.name] ?? '';
    const commonProps = {
      id: field.name,
      name: field.name,
      value,
      onChange: (event) => handleChange(event, field),
      disabled: saving || field.readOnly,
      required: field.required,
      className:
        'block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500',
    };

    if (field.type === 'textarea') {
      return <textarea rows={3} {...commonProps} />;
    }

    if (field.type === 'select' && field.options) {
      return (
        <select {...commonProps}>
          <option value="">Select...</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    const inputType =
      field.type === 'date' ||
      field.type === 'datetime-local' ||
      field.type === 'time' ||
      field.type === 'number' ||
      field.type === 'email' ||
      field.type === 'tel'
        ? field.type
        : 'text';

    return <input type={inputType} {...commonProps} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{config.label}</h2>
        {config.description && (
          <p className="mt-1 text-sm text-slate-600">{config.description}</p>
        )}
      </div>

      <ErrorAlert message={error} />

      <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            Records
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : records.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">No records found.</div>
          ) : (
            <div className="max-h-[28rem] overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    {tableFields.map((field) => (
                      <th key={field.name} className="px-4 py-2 font-medium">
                        {field.label}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {records.map((record) => (
                    <tr key={record[config.primaryKey]} className="hover:bg-slate-50">
                      {tableFields.map((field) => (
                        <td key={field.name} className="px-4 py-2 align-top text-xs text-slate-700">
                          {record[field.name] == null || record[field.name] === ''
                            ? '-'
                            : String(record[field.name])}
                        </td>
                      ))}
                      <td className="whitespace-nowrap px-4 py-2 text-right text-xs">
                        <button
                          type="button"
                          onClick={() => handleEdit(record)}
                          className="mr-2 rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(record)}
                          className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-800">
              {editingRecord ? 'Edit record' : 'Create new record'}
            </h3>
            {editingRecord && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label htmlFor={field.name} className="block text-xs font-medium text-slate-700">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                {renderInput(field)}
                {field.helpText && (
                  <p className="text-xs text-slate-400">{field.helpText}</p>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                {saving ? 'Saving...' : editingRecord ? 'Update record' : 'Create record'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Reset
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
