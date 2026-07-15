import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Briefcase, Search, Loader2 } from 'lucide-react';
import { stripHtml } from './stripHtml'; // path apne project ke hisaab se adjust karo

const API_URL = 'https://www.zwolfconsultancy.com/api/case-studies';

const CaseStudyDashboard = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchCaseStudies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL);
      const rawText = await res.text();

      let json;
      try {
        json = rawText ? JSON.parse(rawText) : {};
      } catch {
        console.error('Non-JSON response received:', rawText.slice(0, 500));
        throw new Error(`Server returned an unexpected response (status ${res.status}).`);
      }

      if (!res.ok) {
        throw new Error(json.message || `Failed to fetch case studies (status ${res.status})`);
      }

      setCaseStudies(json.data || []);
    } catch (err) {
      console.error('fetchCaseStudies error:', err);
      setError(err.message || 'Could not load case studies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const rawText = await res.text();

      let json;
      try {
        json = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error(`Server returned an unexpected response (status ${res.status}).`);
      }

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to delete case study');
      }

      setCaseStudies((prev) => prev.filter((cs) => cs._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete case study.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCaseStudies = caseStudies.filter((cs) =>
    cs.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <Briefcase className="h-7 w-7 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Case Studies</h2>
            <p className="text-sm text-gray-500">Manage all your case study entries</p>
          </div>
        </div>

        <Link
          to="/case-study/create"
          className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Case Study</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchCaseStudies}
            className="text-red-700 font-medium underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Loader2 className="h-8 w-8 text-indigo-600 mx-auto mb-3 animate-spin" />
          <p className="text-sm text-gray-500">Loading case studies...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCaseStudies.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 font-medium mb-1">No case studies found</h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchTerm ? 'Try a different search term.' : 'Get started by adding your first case study.'}
          </p>
          {!searchTerm && (
            <Link
              to="/case-study/create"
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Case Study</span>
            </Link>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filteredCaseStudies.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Study</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCaseStudies.map((cs) => (
                  <tr key={cs._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {cs.image ? (
                          <img src={cs.image} alt={cs.title} className="h-10 w-10 rounded-md object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 max-w-xs truncate">{cs.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-sm truncate">
                      {stripHtml(cs.description)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {cs.createdAt ? new Date(cs.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/case-study/edit/${cs._id}`)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cs._id)}
                          disabled={deletingId === cs._id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                          aria-label="Delete"
                        >
                          {deletingId === cs._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyDashboard;