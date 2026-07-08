import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Briefcase, Search } from 'lucide-react';

const CaseStudyDashboard = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('caseStudies') || '[]');
    setCaseStudies(stored);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;
    const updated = caseStudies.filter((cs) => cs.id !== id);
    setCaseStudies(updated);
    localStorage.setItem('caseStudies', JSON.stringify(updated));
  };

  const filteredCaseStudies = caseStudies.filter((cs) =>
    cs.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cs.client?.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Search by title or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Empty State */}
      {filteredCaseStudies.length === 0 && (
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
      {filteredCaseStudies.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Study</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCaseStudies.map((cs) => (
                  <tr key={cs.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {cs.thumbnail ? (
                          <img src={cs.thumbnail} alt={cs.title} className="h-10 w-10 rounded-md object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 max-w-xs truncate">{cs.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cs.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cs.industry}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cs.year}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/case-study/edit/${cs.id}`)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cs.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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