import React, { useState, useEffect } from 'react';
import { CalendarDays, Trash2, CheckCircle, Clock, XCircle, Users, RefreshCw } from 'lucide-react';

const API_URL = 'https://www.zwolfconsultancy.com/api/appointments';

const STATUS_STYLES = {
  Pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock className="h-3.5 w-3.5" /> },
  Confirmed: { bg: 'bg-green-100',  text: 'text-green-700',  icon: <CheckCircle className="h-3.5 w-3.5" /> },
  Cancelled: { bg: 'bg-red-100',    text: 'text-red-700',    icon: <XCircle className="h-3.5 w-3.5" /> },
};

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setError(null);
      const res = await fetch(API_URL);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setAppointments(json.data);
    } catch (err) {
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filtered = filter === 'All' ? appointments : appointments.filter((a) => a.status === filter);

  const counts = {
    All:       appointments.length,
    Pending:   appointments.filter((a) => a.status === 'Pending').length,
    Confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
    Cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">Manage all appointments</p>
          </div>
        </div>
        <button
          onClick={load}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total',     count: counts.All,       color: 'indigo' },
          { label: 'Pending',   count: counts.Pending,   color: 'yellow' },
          { label: 'Confirmed', count: counts.Confirmed, color: 'green'  },
          { label: 'Cancelled', count: counts.Cancelled, color: 'red'    },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <p className={`text-3xl font-bold text-${color}-600`}>{count}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        {['All', 'Pending', 'Confirmed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400">
          <RefreshCw className="h-10 w-10 mx-auto mb-3 animate-spin opacity-40" />
          <p className="font-medium">Loading appointments...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400">
          <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No appointments found</p>
          <p className="text-sm mt-1">Once a user fills the form, it will appear here.</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Email', 'Phone', 'Service', 'Status', 'Submitted At', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((appt) => {
                  const s = STATUS_STYLES[appt.status] || STATUS_STYLES.Pending;
                  return (
                    <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{appt.name}</td>
                      <td className="px-4 py-3 text-gray-600">{appt.email}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{appt.phone || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {appt.service || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
                          {s.icon}
                          <span>{appt.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {new Date(appt.createdAt).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {appt.status !== 'Confirmed' && (
                            <button
                              onClick={() => updateStatus(appt._id, 'Confirmed')}
                              className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition"
                              title="Confirm"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {appt.status !== 'Cancelled' && (
                            <button
                              onClick={() => updateStatus(appt._id, 'Cancelled')}
                              className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition"
                              title="Cancel"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteAppointment(appt._id)}
                            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-4">
        Auto-refreshes every 10 seconds • {appointments.length} total appointments
      </p>
    </div>
  );
};

export default AdminDashboard;