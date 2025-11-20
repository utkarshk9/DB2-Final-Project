import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { tableConfigs } from './config/tables';
import CrudPage from './components/CrudPage';

function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">The page you are looking for does not exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
          <aside className="w-full border-b border-slate-200 bg-white md:w-64 md:border-b-0 md:border-r">
            <div className="px-4 py-4">
              <h1 className="text-xl font-semibold text-slate-900">Wellness Clinic Admin</h1>
              <p className="mt-1 text-xs text-slate-500">Supabase-backed CRUD admin for clinic data.</p>
            </div>
            <nav className="space-y-1 px-2 pb-4">
              {tableConfigs.map((cfg) => (
                <NavLink
                  key={cfg.id}
                  to={`/${cfg.id}`}
                  className={({ isActive }) =>
                    `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {cfg.icon && <span className="mr-2">{cfg.icon}</span>}
                  {cfg.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/patients" replace />} />
              {tableConfigs.map((cfg) => (
                <Route key={cfg.id} path={`/${cfg.id}`} element={<CrudPage config={cfg} />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
