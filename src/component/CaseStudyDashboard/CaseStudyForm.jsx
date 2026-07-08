import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, X, Upload, Save, Loader2 } from 'lucide-react';

// ⭐ Fallback added so API_BASE_URL never becomes "undefined" in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zwolfconsultancyservice-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/case-studies`;

const emptyForm = {
  title: '',
  description: '',
};

// Safely parse a fetch Response as JSON, even if body is empty or not valid JSON
const safeParseResponse = async (res) => {
  const rawText = await res.text();
  if (!rawText) {
    throw new Error(`Server returned an empty response (status ${res.status}).`);
  }
  try {
    return JSON.parse(rawText);
  } catch {
    console.error('Non-JSON response received:', rawText.slice(0, 500));
    throw new Error(
      `Server returned an unexpected response (status ${res.status}). Check backend logs.`
    );
  }
};

const CaseStudyForm = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null); // actual File object to send
  const [imagePreview, setImagePreview] = useState(''); // for showing preview (existing or new)
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Fetch existing case study data in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchCaseStudy = async () => {
      setLoadingData(true);
      setFormError('');
      try {
        const res = await fetch(`${API_URL}/id/${id}`);
        const json = await safeParseResponse(res);

        if (!res.ok || !json.success) {
          throw new Error(json.message || `Failed to fetch case study (status ${res.status})`);
        }

        const cs = json.data;
        setFormData({ title: cs.title || '', description: cs.description || '' });
        setImagePreview(cs.image || '');
      } catch (err) {
        setFormError(err.message || 'Could not load case study details. Please try again.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchCaseStudy();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection (just preview locally, actual upload happens on submit)
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB}MB.`);
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Image required only when creating (edit mode can keep old image)
    if (!isEditMode && !imageFile) {
      setError('Please upload an image.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const url = isEditMode ? `${API_URL}/${id}` : API_URL;
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: payload, // don't set Content-Type manually, browser sets multipart boundary
      });

      const json = await safeParseResponse(res);

      if (!res.ok || !json.success) {
        throw new Error(json.message || `Request failed with status ${res.status}`);
      }

      navigate('/case-study');
    } catch (err) {
      setFormError(err.message || 'Failed to save case study.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
        <span className="ml-2 text-sm text-gray-500">Loading case study...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <Briefcase className="h-7 w-7 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Case Study' : 'Add New Case Study'}
          </h2>
          <p className="text-sm text-gray-500">
            {isEditMode ? 'Update the case study details' : 'Fill in the details to create a new case study'}
          </p>
        </div>
      </div>

      {formError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Custom E-Commerce Website for UrbanStyle"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Write the full case study description here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image {!isEditMode && <span className="text-red-500">*</span>}
          </label>

          {imagePreview ? (
            <div className="relative group w-full sm:w-64">
              <img
                src={imagePreview}
                alt="Case study preview"
                className="w-full h-40 object-cover rounded-md border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full shadow hover:bg-white transition-colors"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full sm:w-64 h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
              {uploading ? (
                <span className="text-sm text-gray-500">Uploading...</span>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                  <span className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 2MB</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          {isEditMode && !imageFile && imagePreview && (
            <p className="text-xs text-gray-400 mt-1">Leave as is to keep the current image, or upload a new one to replace it.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/case-study')}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>
              {submitting
                ? 'Saving...'
                : isEditMode
                ? 'Update Case Study'
                : 'Save Case Study'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseStudyForm;